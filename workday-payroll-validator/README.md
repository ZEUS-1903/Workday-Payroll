# Workday Payroll Validator - Learning Project

A quick MVP project to learn Workday API integration patterns by building a payroll validator that compares Workday employee data against a legacy HR system.

## 📚 What You'll Learn

This project teaches you:

- **REST API Integration**: How to call mock APIs (Workday and Legacy HR patterns)
- **Data Validation**: Comparing data between two systems and detecting discrepancies
- **Error Handling**: Severity levels for different types of mismatches
- **Backend with Express**: Building API endpoints in Node.js
- **Frontend with Vanilla JS**: Displaying complex data in an interactive UI
- **Real-World Patterns**: How enterprise systems handle payroll data integration

## 🏗️ Project Structure

```
workday-payroll-validator/
├── package.json           # Project dependencies
├── server.js             # Express server with all endpoints
├── mockData.js           # Mock Workday and Legacy HR data
├── payrollValidator.js   # Validation logic
└── README.md            # This file
```

## 🔧 How It Works

### 1. **Mock Workday API** (`/api/workday/*`)
Simulates Workday REST endpoints:
- `GET /api/workday/workers` - Fetch all employees
- `GET /api/workday/workers/:id` - Fetch single employee

### 2. **Mock Legacy HR API** (`/api/legacy/*`)
Simulates a legacy HR system:
- `GET /api/legacy/employees` - Fetch all employees  
- `GET /api/legacy/employees/:id` - Fetch single employee

### 3. **Validation Engine** (`/api/validate/*`)
Compares the two systems:
- `POST /api/validate/payroll` - Run full validation
- `GET /api/validate/status` - Check system health

### 4. **Payroll Validator Class**
The core logic that:
- Checks for missing records
- Compares field values (salary, position, department, status)
- Assigns severity levels (HIGH, MEDIUM, LOW)
- Sorts results for easy review

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd workday-payroll-validator
npm install
```

### 2. Start the Server
```bash
npm start
```

Output:
```
✅ Payroll Validator Server Running
📍 Open http://localhost:3000 in your browser
```

### 3. Open in Browser
- Visit **http://localhost:3000**
- Click "Run Validation"
- View results in tabs

## 📊 Sample Data

The project includes **5 employees** with intentional discrepancies:

| Employee | Discrepancy | Field | Workday | Legacy HR |
|----------|-------------|-------|---------|-----------|
| Bob Smith | Salary Mismatch | salary | $72,000 | $70,000 |
| Carol Davis | Title Difference | position | Engineering Manager | Manager - Engineering |
| Diana Wilson | Department Name | department | Analytics | Data |
| Eve Martinez | Status Mismatch | status | Active | Inactive |

## 📋 API Examples

### Fetch Workday Employees
```bash
curl http://localhost:3000/api/workday/workers
```

Response:
```json
{
  "data": [
    {
      "id": "EMP001",
      "name": "Alice Johnson",
      "salary": 85000,
      "position": "Senior Software Engineer",
      "department": "Engineering",
      "status": "Active"
    }
  ],
  "meta": {
    "total": 5,
    "system": "Workday",
    "version": "v1"
  }
}
```

### Run Validation
```bash
curl -X POST http://localhost:3000/api/validate/payroll
```

Response:
```json
{
  "success": true,
  "timestamp": "2026-09-29T15:50:00.000Z",
  "results": {
    "summary": {
      "totalEmployees": 5,
      "discrepanciesFound": 4,
      "bySeverity": {
        "high": 1,
        "medium": 2,
        "low": 1
      },
      "overallStatus": "FAIL"
    },
    "discrepancies": [
      {
        "employeeId": "EMP002",
        "employeeName": "Bob Smith",
        "type": "VALUE_MISMATCH",
        "field": "salary",
        "workdayValue": 72000,
        "legacyValue": 70000,
        "severity": "HIGH"
      }
    ]
  }
}
```

## 🎓 Key Concepts Explained

### Severity Levels
- **HIGH**: Critical issues (salary mismatches, status problems)
- **MEDIUM**: Important differences (position, department, employee records)
- **LOW**: Minor discrepancies

### Discrepancy Types
- `VALUE_MISMATCH`: Same field, different values
- `MISSING_IN_LEGACY`: Record in Workday but not in Legacy HR
- `EXTRA_IN_LEGACY`: Record in Legacy HR but not in Workday

## 🔍 Validation Logic

The validator checks:
1. **Record existence** - Do all employees exist in both systems?
2. **Field matching** - Are name, email, salary, position, department, status the same?
3. **Severity assessment** - How critical is each discrepancy?

## 💡 What to Try Next

1. **Add more fields** to validation (hire date, benefits, etc.)
2. **Create export feature** (CSV/JSON of discrepancies)
3. **Add filtering** by department or severity
4. **Build a "fix" endpoint** to patch discrepancies
5. **Add real Workday API** credentials to connect to actual data
6. **Implement scheduling** to run validation daily

## 🔐 Real Workday Integration (Future)

When ready to use real Workday data, you'd:

```javascript
// Replace mock data with real API calls
const workdayConfig = {
  baseUrl: 'https://api.workday.com/v1',
  clientId: process.env.WORKDAY_CLIENT_ID,
  clientSecret: process.env.WORKDAY_CLIENT_SECRET
};

// Authenticate and fetch real data
async function getWorkdayEmployees() {
  const token = await getWorkdayToken(workdayConfig);
  const response = await fetch(
    `${workdayConfig.baseUrl}/workers`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

## 📚 Resources

- [Workday REST API Documentation](https://docs.workday.com)
- [Express.js Guide](https://expressjs.com)
- [API Design Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)

---

**Happy Learning! 🚀**

Built for understanding Workday integration patterns and enterprise data validation.
