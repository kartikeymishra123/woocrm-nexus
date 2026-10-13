import express from 'express';
import { store } from '../data/store.js';
import { WorkflowEngine } from '../services/workflowEngine.js';

const router = express.Router();

// GET all workflows
router.get('/', (req, res) => {
  try {
    const workflows = store.getWorkflows();
    res.json({ success: true, count: workflows.length, data: workflows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET workflow logs
router.get('/logs/recent', (req, res) => {
  try {
    const logs = store.getWorkflowLogs();
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single workflow
router.get('/:id', (req, res) => {
  try {
    const wf = store.getWorkflowById(req.params.id);
    if (!wf) return res.status(404).json({ success: false, message: 'Workflow not found' });
    res.json({ success: true, data: wf });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create workflow
router.post('/', (req, res) => {
  try {
    const created = store.addWorkflow(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update workflow
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateWorkflow(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Workflow not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE workflow
router.delete('/:id', (req, res) => {
  try {
    store.deleteWorkflow(req.params.id);
    res.json({ success: true, message: 'Workflow removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST test run workflow
router.post('/:id/test', async (req, res) => {
  try {
    const workflow = store.getWorkflowById(req.params.id);
    if (!workflow) return res.status(404).json({ success: false, message: 'Workflow not found' });

    // Pick first order and customer for testing simulation
    const orders = store.getOrders();
    const customers = store.getCustomers();
    const testOrder = orders[0] || { id: 9999, total: 350.00, status: 'shipped', tracking: { carrier: 'DHL', tracking_number: 'DHL-TEST-123', url: 'https://dhl.com' } };
    const testCustomer = customers[0] || { id: 101, first_name: 'Eleanor', last_name: 'Vance', email: 'eleanor@example.com' };

    const payload = {
      order: testOrder,
      customer: testCustomer,
      status: testOrder.status
    };

    const conditionPassed = WorkflowEngine.evaluateCondition(workflow.condition, payload);

    let actionsResult = [];
    if (conditionPassed) {
      actionsResult = await WorkflowEngine.executeActions(workflow, payload);

      store.addWorkflowLog({
        workflow_id: workflow.id,
        workflow_name: workflow.name,
        event: 'manual.test_run',
        order_id: testOrder.id,
        customer_name: `${testCustomer.first_name} ${testCustomer.last_name}`,
        status: 'success',
        details: `Test execution succeeded! ${workflow.actions.length} action(s) evaluated.`
      });
    }

    res.json({
      success: true,
      conditionPassed,
      testPayload: payload,
      executionTrace: actionsResult,
      message: conditionPassed ? 'Workflow executed successfully!' : 'Workflow condition evaluated to false (no actions fired).'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
