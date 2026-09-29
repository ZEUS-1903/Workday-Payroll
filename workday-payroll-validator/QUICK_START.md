# 🚀 Quick Start Guide

## Step 1: Navigate to Project Directory
```bash
cd workday-payroll-validator
```

## Step 2: Install Dependencies (already done)
```bash
npm install
```

## Step 3: Start the Server
```bash
npm start
```

You should see:
```
✅ Payroll Validator Server Running
📍 Open http://localhost:3000 in your browser

📚 API Endpoints:
   GET  /api/workday/workers         - Fetch Workday employees
   GET  /api/legacy/employees        - Fetch Legacy HR employees
   POST /api/validate/payroll        - Run validation
   GET  /api/validate/status         - Check system status
```

## Step 4: Open Browser
Go to: **http://localhost:3000**

## Step 5: Run Validation
Click the **"Run Validation"** button and watch the results appear!

---

## 🎯 What Each Button Does

### Run Validation
- Compares all employees in Workday vs Legacy HR
- Shows discrepancies with severity levels
- Displays summary statistics

### Check Status
- Verifies both systems are reachable
- Shows record counts
- Confirms API connectivity

### Clear Results
- Resets the display
- Clears any errors

---

## 📊 Understanding the Results

### Tabs Explained

**Summary**: Overall results and statistics
- Total employees
- Number of discrepancies
- Breakdown by severity (High/Medium/Low)
- Overall status (PASS/FAIL)

**Discrepancies**: Detailed list of all issues
- Employee name and ID
- Which field differs
- Workday value vs Legacy value
- Severity level

**Workday Data**: View all employees in Workday system
- Shows exactly what Workday has
- Position, department, salary, status

**Legacy HR Data**: View all employees in Legacy system
- Shows exactly what Legacy HR has
- For comparison with Workday

---

## 🔍 Sample Discrepancies You'll See

1. **Bob Smith - Salary Mismatch** (HIGH)
   - Workday: $72,000
   - Legacy: $70,000

2. **Carol Davis - Position Title** (MEDIUM)
   - Workday: Engineering Manager
   - Legacy: Manager - Engineering

3. **Diana Wilson - Department Name** (MEDIUM)
   - Workday: Analytics
   - Legacy: Data

4. **Eve Martinez - Status Mismatch** (MEDIUM)
   - Workday: Active
   - Legacy: Inactive

---

## 💻 API Endpoints (Direct Usage)

### Using cURL

Fetch Workday employees:
```bash
curl http://localhost:3000/api/workday/workers
```

Run validation:
```bash
curl -X POST http://localhost:3000/api/validate/payroll
```

Check status:
```bash
curl http://localhost:3000/api/validate/status
```

---

## 🎓 Learning Objectives Covered

✅ REST API patterns (GET, POST)  
✅ Mock data structures  
✅ Validation logic and algorithms  
✅ Error handling and severity levels  
✅ Frontend-backend communication  
✅ Interactive data visualization  
✅ Real-world enterprise patterns  

---

## 🛠️ Troubleshooting

**Port 3000 already in use?**
```bash
# Find what's using port 3000
lsof -i :3000

# Or use a different port in server.js
const PORT = 3001;
```

**Can't access localhost:3000?**
- Make sure the server is running
- Check the console for error messages
- Try http://127.0.0.1:3000

**Need to stop the server?**
Press `Ctrl + C` in your terminal

---

## 📚 Next Steps

After exploring the current project:

1. **Add new validation rules** (in `payrollValidator.js`)
2. **Modify mock data** to add more discrepancies
3. **Export results** to CSV/JSON
4. **Add department filtering**
5. **Connect to real Workday API** when ready

---

**Questions? Check README.md for detailed documentation!**
