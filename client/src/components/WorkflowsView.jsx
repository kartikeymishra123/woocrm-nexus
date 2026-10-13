import React, { useState } from 'react';
import { 
  GitBranch, 
  Play, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  MessageSquare, 
  Tag, 
  Zap, 
  ArrowRight, 
  Sparkles,
  ChevronDown,
  Trash2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WorkflowsView({ 
  workflows, 
  workflowLogs, 
  onToggleWorkflow, 
  onTestWorkflow, 
  onCreateWorkflow,
  onDeleteWorkflow 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testingWorkflowId, setTestingWorkflowId] = useState(null);

  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    triggerType: 'order.created',
    triggerTargetStatus: 'shipped',
    conditionField: 'order.total',
    conditionOperator: 'greater_than_or_equal',
    conditionValue: '150',
    actionType: 'send_email',
    emailSubject: 'Thank you for your order, {{customer.name}}!',
    emailBody: 'Hi {{customer.name}}, we appreciate your order #{{order.id}} totaling {{order.total}}.'
  });

  const handleTestClick = async (workflowId) => {
    setTestingWorkflowId(workflowId);
    try {
      const res = await onTestWorkflow(workflowId);
      setTestResult(res);
      if (res.conditionPassed) {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      }
    } finally {
      setTestingWorkflowId(null);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newWorkflow.name) return;

    const payload = {
      name: newWorkflow.name,
      description: newWorkflow.description || 'Custom WooCommerce communication automation.',
      active: true,
      trigger: {
        type: newWorkflow.triggerType,
        target_status: newWorkflow.triggerType === 'order.status_changed' ? newWorkflow.triggerTargetStatus : undefined,
        label: newWorkflow.triggerType === 'order.created' ? 'Order Created in WooCommerce' : `Order Status becomes '${newWorkflow.triggerTargetStatus}'`
      },
      condition: {
        field: newWorkflow.conditionField,
        operator: newWorkflow.conditionOperator,
        value: Number(newWorkflow.conditionValue) || newWorkflow.conditionValue,
        label: `${newWorkflow.conditionField} ${newWorkflow.conditionOperator} ${newWorkflow.conditionValue}`
      },
      actions: [
        {
          type: newWorkflow.actionType,
          params: {
            subject: newWorkflow.emailSubject,
            body: newWorkflow.emailBody
          },
          label: newWorkflow.actionType === 'send_email' ? 'Send Automated Email' : 'Send SMS Notification'
        }
      ]
    };

    onCreateWorkflow(payload);
    setShowCreateModal(false);
    setNewWorkflow({
      name: '',
      description: '',
      triggerType: 'order.created',
      triggerTargetStatus: 'shipped',
      conditionField: 'order.total',
      conditionOperator: 'greater_than_or_equal',
      conditionValue: '150',
      actionType: 'send_email',
      emailSubject: 'Thank you for your order, {{customer.name}}!',
      emailBody: 'Hi {{customer.name}}, we appreciate your order #{{order.id}} totaling {{order.total}}.'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Visual Communication Workflows</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              {workflows.filter(w => w.active).length} Active Rules
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Autonomous trigger-condition-action engine reacting to live WooCommerce customer & order events.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Workflow</span>
        </button>
      </div>

      {/* Workflows Cards List */}
      <div className="space-y-4">
        {workflows.map((wf) => {
          return (
            <div
              key={wf.id}
              className={`p-6 rounded-2xl glass-card transition-all border ${
                wf.active ? 'border-slate-800 hover:border-indigo-500/40' : 'border-slate-800/40 opacity-70'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-base">{wf.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      wf.active 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-slate-700/40 text-slate-400'
                    }`}>
                      {wf.active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">{wf.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Test button */}
                  <button
                    onClick={() => handleTestClick(wf.id)}
                    disabled={testingWorkflowId === wf.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Play className={`w-3.5 h-3.5 text-indigo-400 ${testingWorkflowId === wf.id ? 'animate-spin' : ''}`} />
                    <span>{testingWorkflowId === wf.id ? 'Testing...' : 'Test Workflow'}</span>
                  </button>

                  {/* Toggle Active button */}
                  <button
                    onClick={() => onToggleWorkflow(wf.id, !wf.active)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      wf.active
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {wf.active ? 'Active' : 'Activate'}
                  </button>

                  <button
                    onClick={() => onDeleteWorkflow(wf.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Node Graph: Trigger -> Condition -> Actions */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
                {/* Trigger Node */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200">
                  <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">Trigger</span>
                    <span className="font-semibold">{wf.trigger?.label || wf.trigger?.type}</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

                {/* Condition Node */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
                  <GitBranch className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Condition</span>
                    <span className="font-semibold">{wf.condition?.label || wf.condition?.field}</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

                {/* Actions Nodes */}
                <div className="flex flex-wrap items-center gap-2">
                  {wf.actions?.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-200"
                    >
                      {act.type === 'send_email' ? (
                        <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : act.type === 'send_sms' ? (
                        <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Action</span>
                        <span className="font-semibold">{act.label || act.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Metrics */}
              <div className="mt-3 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Fired <strong>{wf.executions_count || 0} times</strong>
                </span>
                <span>
                  Last executed: {wf.last_executed ? new Date(wf.last_executed).toLocaleString() : 'Never'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Execution Output Modal */}
      {testResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-xl w-full rounded-2xl glass-dropdown p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  testResult.conditionPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {testResult.conditionPassed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Workflow Sandbox Execution Trace</h3>
                  <div className="text-xs text-slate-400">Dry-run evaluated against simulated WooCommerce payload</div>
                </div>
              </div>
              <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Condition Evaluation:</span>
                <span className={`font-bold ${testResult.conditionPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {testResult.conditionPassed ? 'PASSED (TRUE)' : 'SKIPPED (FALSE)'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Target Customer & Order:</span>
                <div className="text-slate-200">
                  {testResult.testPayload?.customer?.first_name} {testResult.testPayload?.customer?.last_name} ({testResult.testPayload?.customer?.email})
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Order #{testResult.testPayload?.order?.id} • Total: ${testResult.testPayload?.order?.total} • Status: {testResult.testPayload?.order?.status}
                </div>
              </div>

              {testResult.executionTrace?.executedActions && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1.5">Executed Actions:</span>
                  <div className="space-y-1">
                    {testResult.executionTrace.executedActions.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-emerald-300 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dispatched {act.type.toUpperCase()} successfully</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setTestResult(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Execution History Logs Table */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-1">Workflow Execution Audit Trail</h3>
        <p className="text-xs text-slate-400 mb-4">Historical log of every autonomous action dispatched by WooCRM Nexus.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-800">
            <thead>
              <tr className="text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Workflow</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {workflowLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {log.workflow_name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-mono text-[10px]">
                      {log.event}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200">
                    {log.customer_name}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-lg w-full rounded-2xl glass-dropdown p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Create Automation Workflow</h3>
            <p className="text-xs text-slate-400 mb-4">Define trigger, condition, and communication action.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Workflow Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Gift Voucher on $200+ Order"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  placeholder="Explains what this workflow accomplishes"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Trigger Event</label>
                  <select
                    value={newWorkflow.triggerType}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, triggerType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="order.created">Order Created</option>
                    <option value="order.status_changed">Order Status Changed</option>
                    <option value="customer.inactive_30d">Customer Inactive &gt; 30d</option>
                  </select>
                </div>

                {newWorkflow.triggerType === 'order.status_changed' && (
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Target Status</label>
                    <select
                      value={newWorkflow.triggerTargetStatus}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, triggerTargetStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="processing">Processing</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Condition Field</label>
                  <input
                    type="text"
                    value={newWorkflow.conditionField}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, conditionField: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Operator</label>
                  <select
                    value={newWorkflow.conditionOperator}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, conditionOperator: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="greater_than_or_equal">&gt;=</option>
                    <option value="greater_than">&gt;</option>
                    <option value="equals">==</option>
                    <option value="exists">Exists</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Threshold Value</label>
                  <input
                    type="text"
                    value={newWorkflow.conditionValue}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, conditionValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Action Subject Template</label>
                <input
                  type="text"
                  value={newWorkflow.emailSubject}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, emailSubject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Action Message Body</label>
                <textarea
                  rows="3"
                  value={newWorkflow.emailBody}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, emailBody: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Supports dynamic tags: <code>{'{{customer.name}}'}</code>, <code>{'{{order.id}}'}</code>, <code>{'{{order.total}}'}</code>, <code>{'{{order.tracking.url}}'}</code>
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
