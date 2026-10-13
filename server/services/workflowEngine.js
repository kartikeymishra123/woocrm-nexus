import { store } from '../data/store.js';

export class WorkflowEngine {
  /**
   * Dispatches an event to all active workflows
   * @param {string} eventType - e.g. 'order.created', 'order.status_changed'
   * @param {object} payload - { order, customer, status, ... }
   */
  static async triggerEvent(eventType, payload) {
    const workflows = store.getWorkflows().filter(w => w.active);
    const results = [];

    for (const workflow of workflows) {
      if (this.matchesTrigger(workflow.trigger, eventType, payload)) {
        if (this.evaluateCondition(workflow.condition, payload)) {
          const executionResult = await this.executeActions(workflow, payload);
          results.push(executionResult);

          // Update workflow metrics
          store.updateWorkflow(workflow.id, {
            executions_count: (workflow.executions_count || 0) + 1,
            last_executed: new Date().toISOString()
          });

          // Log workflow execution
          store.addWorkflowLog({
            workflow_id: workflow.id,
            workflow_name: workflow.name,
            event: eventType,
            order_id: payload.order?.id || null,
            customer_name: payload.customer?.first_name ? `${payload.customer.first_name} ${payload.customer.last_name}` : payload.order?.customer_name || 'Customer',
            status: 'success',
            details: `Actions executed: ${workflow.actions.map(a => a.type).join(', ')}`
          });
        }
      }
    }

    return results;
  }

  static matchesTrigger(trigger, eventType, payload) {
    if (!trigger) return false;
    if (trigger.type !== eventType) return false;

    if (eventType === 'order.status_changed' && trigger.target_status) {
      const currentStatus = payload.order?.status || payload.status;
      if (trigger.target_status !== currentStatus) {
        return false;
      }
    }

    return true;
  }

  static evaluateCondition(condition, payload) {
    if (!condition) return true;
    if (condition.field === 'always') return true;

    const getValue = (path, obj) => {
      const parts = path.split('.');
      let curr = obj;
      for (const p of parts) {
        if (curr === undefined || curr === null) return undefined;
        curr = curr[p];
      }
      return curr;
    };

    const actual = getValue(condition.field, payload);
    const expected = condition.value;

    switch (condition.operator) {
      case 'greater_than_or_equal':
      case '>=':
        return Number(actual) >= Number(expected);
      case 'greater_than':
      case '>':
        return Number(actual) > Number(expected);
      case 'less_than':
      case '<':
        return Number(actual) < Number(expected);
      case 'equals':
      case '==':
        return String(actual).toLowerCase() === String(expected).toLowerCase();
      case 'exists':
        return actual !== undefined && actual !== null && actual !== '';
      case 'contains':
        return String(actual).toLowerCase().includes(String(expected).toLowerCase());
      default:
        return true;
    }
  }

  static async executeActions(workflow, payload) {
    const executedActions = [];

    const interpolate = (template) => {
      if (!template) return '';
      const order = payload.order || {};
      const customer = payload.customer || (order.customer_id ? store.getCustomerById(order.customer_id) : {}) || {};
      const tracking = order.tracking || {};

      return template
        .replace(/{{customer\.name}}/g, `${customer.first_name || order.customer_name || 'Valued Patron'}`)
        .replace(/{{customer\.first_name}}/g, customer.first_name || 'there')
        .replace(/{{customer\.email}}/g, customer.email || order.customer_email || '')
        .replace(/{{customer\.phone}}/g, customer.phone || '')
        .replace(/{{order\.id}}/g, order.id || '')
        .replace(/{{order\.number}}/g, order.order_number || `#${order.id}`)
        .replace(/{{order\.total}}/g, `$${Number(order.total || 0).toFixed(2)}`)
        .replace(/{{order\.status}}/g, order.status || '')
        .replace(/{{order\.tracking\.carrier}}/g, tracking.carrier || 'Carrier')
        .replace(/{{order\.tracking\.number}}/g, tracking.tracking_number || 'N/A')
        .replace(/{{order\.tracking\.url}}/g, tracking.url || '#');
    };

    const customer = payload.customer || (payload.order?.customer_id ? store.getCustomerById(payload.order.customer_id) : null);

    for (const action of workflow.actions) {
      switch (action.type) {
        case 'send_email': {
          const subject = interpolate(action.params.subject);
          const body = interpolate(action.params.body);
          const comm = store.addCommunication({
            customer_id: customer?.id || payload.order?.customer_id || null,
            customer_name: customer ? `${customer.first_name} ${customer.last_name}` : payload.order?.customer_name || 'Customer',
            channel: 'email',
            type: 'automated',
            subject,
            content: body,
            status: 'Delivered',
            order_id: payload.order?.id || null,
            workflow_id: workflow.id
          });
          executedActions.push({ type: 'send_email', commId: comm.id });
          break;
        }

        case 'send_sms': {
          const message = interpolate(action.params.message);
          const comm = store.addCommunication({
            customer_id: customer?.id || payload.order?.customer_id || null,
            customer_name: customer ? `${customer.first_name} ${customer.last_name}` : payload.order?.customer_name || 'Customer',
            channel: 'sms',
            type: 'automated',
            subject: 'SMS Notification',
            content: message,
            status: 'Sent',
            order_id: payload.order?.id || null,
            workflow_id: workflow.id
          });
          executedActions.push({ type: 'send_sms', commId: comm.id });
          break;
        }

        case 'add_customer_tag': {
          if (customer?.id && action.params.tag) {
            store.addCustomerTag(customer.id, action.params.tag);
            executedActions.push({ type: 'add_customer_tag', tag: action.params.tag });
          }
          break;
        }

        case 'add_note': {
          if (customer?.id && action.params.note) {
            store.addCustomerNote(customer.id, interpolate(action.params.note), `Workflow: ${workflow.name}`);
            executedActions.push({ type: 'add_note' });
          }
          break;
        }
      }
    }

    return { workflowId: workflow.id, workflowName: workflow.name, executedActions };
  }
}
