const express = require('express');
const path = require('path');
const { workdayEmployees, legacyHREmployees } = require('./mockData');
const PayrollValidator = require('./payrollValidator');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

/**
 * WORKDAY API ENDPOINTS (Mock Workday REST API)
 * These mimic how you'd call real Workday APIs
 */

// GET /api/workday/workers - Get all employees from Workday
app.get('/api/workday/workers', (req, res) => {
  // Simulating Workday API authentication headers
  console.log('[Workday API] GET /workers - Retrieving employee data');
  res.json({
    data: workdayEmployees,
    meta: {
      total: workdayEmployees.length,
      system: "Workday",
      version: "v1"
    }
  });
});

// GET /api/workday/workers/:id - Get specific employee from Workday
app.get('/api/workday/workers/:id', (req, res) => {
  const employee = workdayEmployees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found in Workday' });
  }
  res.json({ data: employee });
});

/**
 * LEGACY HR API ENDPOINTS (Mock Legacy System REST API)
 */

// GET /api/legacy/employees - Get all employees from Legacy HR
app.get('/api/legacy/employees', (req, res) => {
  console.log('[Legacy HR API] GET /employees - Retrieving employee data');
  res.json({
    data: legacyHREmployees,
    meta: {
      total: legacyHREmployees.length,
      system: "Legacy HR System",
      version: "v2"
    }
  });
});

// GET /api/legacy/employees/:id - Get specific employee from Legacy HR
app.get('/api/legacy/employees/:id', (req, res) => {
  const employee = legacyHREmployees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found in Legacy HR' });
  }
  res.json({ data: employee });
});

/**
 * VALIDATION ENDPOINTS
 * These are what you'd use to run the actual validation
 */

// POST /api/validate/payroll - Run full payroll validation
app.post('/api/validate/payroll', (req, res) => {
  try {
    console.log('[Validator] Running payroll validation');
    const validator = new PayrollValidator(workdayEmployees, legacyHREmployees);
    const results = validator.validateAll();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/validate/status - Get validation health check
app.get('/api/validate/status', (req, res) => {
  res.json({
    status: 'healthy',
    systems: {
      workday: {
        status: 'connected',
        recordCount: workdayEmployees.length
      },
      legacyHR: {
        status: 'connected',
        recordCount: legacyHREmployees.length
      }
    }
  });
});

// Serve main HTML page
app.get('/', (req, res) => {
  res.send(getHTMLPage());
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Payroll Validator Server Running`);
  console.log(`📍 Open http://localhost:${PORT} in your browser`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   GET  /api/workday/workers         - Fetch Workday employees`);
  console.log(`   GET  /api/legacy/employees        - Fetch Legacy HR employees`);
  console.log(`   POST /api/validate/payroll        - Run validation`);
  console.log(`   GET  /api/validate/status         - Check system status\n`);
});

/**
 * HTML Frontend
 */
function getHTMLPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workday Payroll Validator</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    header p {
      font-size: 1.1em;
      opacity: 0.95;
    }

    .content {
      padding: 40px;
    }

    .controls {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    button {
      padding: 12px 24px;
      font-size: 1em;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .loading {
      display: none;
      text-align: center;
      padding: 20px;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    .tab-button {
      padding: 10px 20px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: 600;
      color: #666;
      transition: all 0.3s ease;
    }

    .tab-button.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    .results-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .summary-card.pass {
      border-left-color: #4caf50;
    }

    .summary-card.fail {
      border-left-color: #f44336;
    }

    .summary-card h3 {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .summary-card .value {
      font-size: 2.5em;
      font-weight: bold;
      color: #667eea;
    }

    .summary-card.pass .value {
      color: #4caf50;
    }

    .summary-card.fail .value {
      color: #f44336;
    }

    .discrepancies-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .discrepancies-table th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    .discrepancies-table td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    .discrepancies-table tr:hover {
      background: #fafafa;
    }

    .severity {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
    }

    .severity.high {
      background: #ffebee;
      color: #c62828;
    }

    .severity.medium {
      background: #fff3e0;
      color: #e65100;
    }

    .severity.low {
      background: #f1f8e9;
      color: #558b2f;
    }

    .employee-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .employee-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .employee-card h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .employee-card .employee-id {
      font-size: 0.9em;
      color: #999;
      margin-bottom: 8px;
    }

    .employee-field {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 0.95em;
      border-bottom: 1px solid #e0e0e0;
    }

    .employee-field:last-child {
      border-bottom: none;
    }

    .employee-field label {
      font-weight: 600;
      color: #666;
    }

    .employee-field value {
      color: #333;
    }

    .no-discrepancies {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔍 Workday Payroll Validator</h1>
      <p>Compare Workday and Legacy HR System payroll data</p>
    </header>

    <div class="content">
      <div class="controls">
        <button class="btn-primary" onclick="runValidation()">Run Validation</button>
        <button class="btn-secondary" onclick="checkSystemStatus()">Check Status</button>
        <button class="btn-secondary" onclick="clearResults()">Clear Results</button>
      </div>

      <div id="loading" class="loading">
        <div class="spinner"></div>
        <p>Running validation...</p>
      </div>

      <div id="errorContainer"></div>

      <div id="results" style="display: none;">
        <div class="tabs">
          <button class="tab-button active" onclick="switchTab('summary')">Summary</button>
          <button class="tab-button" onclick="switchTab('discrepancies')">Discrepancies</button>
          <button class="tab-button" onclick="switchTab('workday')">Workday Data</button>
          <button class="tab-button" onclick="switchTab('legacy')">Legacy HR Data</button>
        </div>

        <!-- Summary Tab -->
        <div id="summary" class="tab-content active">
          <div id="summaryContent"></div>
        </div>

        <!-- Discrepancies Tab -->
        <div id="discrepancies" class="tab-content">
          <div id="discrepanciesContent"></div>
        </div>

        <!-- Workday Tab -->
        <div id="workday" class="tab-content">
          <div id="workdayContent"></div>
        </div>

        <!-- Legacy HR Tab -->
        <div id="legacy" class="tab-content">
          <div id="legacyContent"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function runValidation() {
      const loading = document.getElementById('loading');
      const results = document.getElementById('results');
      const errorContainer = document.getElementById('errorContainer');

      loading.style.display = 'block';
      results.style.display = 'none';
      errorContainer.innerHTML = '';

      try {
        const response = await fetch('/api/validate/payroll', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
          displayResults(data.results);
          results.style.display = 'block';
        } else {
          errorContainer.innerHTML = \`<div class="error-message">Error: \${data.error}</div>\`;
        }
      } catch (error) {
        errorContainer.innerHTML = \`<div class="error-message">Error: \${error.message}</div>\`;
      } finally {
        loading.style.display = 'none';
      }
    }

    async function checkSystemStatus() {
      try {
        const response = await fetch('/api/validate/status');
        const data = await response.json();
        alert(\`System Status:\\n\\nWorkday: \${data.systems.workday.status} (\${data.systems.workday.recordCount} records)\\nLegacy HR: \${data.systems.legacyHR.status} (\${data.systems.legacyHR.recordCount} records)\`);
      } catch (error) {
        alert('Error checking status: ' + error.message);
      }
    }

    async function fetchWorkdayData() {
      const response = await fetch('/api/workday/workers');
      return await response.json();
    }

    async function fetchLegacyData() {
      const response = await fetch('/api/legacy/employees');
      return await response.json();
    }

    function displayResults(results) {
      displaySummary(results);
      displayDiscrepancies(results.discrepancies);

      // Fetch and display raw data
      Promise.all([fetchWorkdayData(), fetchLegacyData()]).then(([workday, legacy]) => {
        displayEmployeeList('workday', workday.data);
        displayEmployeeList('legacy', legacy.data);
      });
    }

    function displaySummary(results) {
      const summary = results.summary;
      const status = summary.overallStatus === 'PASS' ? 'pass' : 'fail';
      const statusText = summary.overallStatus === 'PASS' ? '✅ PASS' : '⚠️ FAIL';

      let html = \`
        <div class="results-summary">
          <div class="summary-card \${status}">
            <h3>Overall Status</h3>
            <div class="value">\${statusText}</div>
          </div>
          <div class="summary-card">
            <h3>Total Employees</h3>
            <div class="value">\${summary.totalEmployees}</div>
          </div>
          <div class="summary-card \${summary.discrepanciesFound > 0 ? 'fail' : 'pass'}">
            <h3>Discrepancies Found</h3>
            <div class="value">\${summary.discrepanciesFound}</div>
          </div>
          <div class="summary-card">
            <h3>High Severity</h3>
            <div class="value">\${summary.bySeverity.high}</div>
          </div>
          <div class="summary-card">
            <h3>Medium Severity</h3>
            <div class="value">\${summary.bySeverity.medium}</div>
          </div>
          <div class="summary-card">
            <h3>Low Severity</h3>
            <div class="value">\${summary.bySeverity.low}</div>
          </div>
        </div>
      \`;

      document.getElementById('summaryContent').innerHTML = html;
    }

    function displayDiscrepancies(discrepancies) {
      if (discrepancies.length === 0) {
        document.getElementById('discrepanciesContent').innerHTML = '<div class="no-discrepancies">✅ No discrepancies found - all systems in sync!</div>';
        return;
      }

      let html = '<table class="discrepancies-table"><thead><tr>';
      html += '<th>Employee</th><th>ID</th><th>Field</th><th>Type</th><th>Workday Value</th><th>Legacy Value</th><th>Severity</th>';
      html += '</tr></thead><tbody>';

      for (const disc of discrepancies) {
        html += \`<tr>
          <td>\${disc.employeeName}</td>
          <td>\${disc.employeeId}</td>
          <td><strong>\${disc.field}</strong></td>
          <td>\${disc.type}</td>
          <td><code>\${disc.workdayValue}</code></td>
          <td><code>\${disc.legacyValue}</code></td>
          <td><span class="severity \${disc.severity.toLowerCase()}">\${disc.severity}</span></td>
        </tr>\`;
      }

      html += '</tbody></table>';
      document.getElementById('discrepanciesContent').innerHTML = html;
    }

    function displayEmployeeList(system, employees) {
      let html = '<div class="employee-list">';

      for (const emp of employees) {
        html += \`
          <div class="employee-card">
            <h3>\${emp.name}</h3>
            <div class="employee-id">ID: \${emp.id}</div>
            <div class="employee-field">
              <label>Position:</label>
              <span>\${emp.position}</span>
            </div>
            <div class="employee-field">
              <label>Department:</label>
              <span>\${emp.department}</span>
            </div>
            <div class="employee-field">
              <label>Salary:</label>
              <span>\$\${emp.salary.toLocaleString()}</span>
            </div>
            <div class="employee-field">
              <label>Status:</label>
              <span>\${emp.status}</span>
            </div>
          </div>
        \`;
      }

      html += '</div>';
      document.getElementById(system + 'Content').innerHTML = html;
    }

    function switchTab(tabName) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });

      // Show selected tab
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');
    }

    function clearResults() {
      document.getElementById('results').style.display = 'none';
      document.getElementById('errorContainer').innerHTML = '';
    }
  </script>
</body>
</html>
  `;
}

module.exports = app;
