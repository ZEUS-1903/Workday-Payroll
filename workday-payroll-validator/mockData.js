// Mock Workday Employee Data
const workdayEmployees = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    salary: 85000,
    position: "Senior Software Engineer",
    department: "Engineering",
    startDate: "2020-03-15",
    status: "Active"
  },
  {
    id: "EMP002",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    salary: 72000,
    position: "Product Manager",
    department: "Product",
    startDate: "2021-06-20",
    status: "Active"
  },
  {
    id: "EMP003",
    name: "Carol Davis",
    email: "carol.davis@company.com",
    salary: 95000,
    position: "Engineering Manager",
    department: "Engineering",
    startDate: "2019-01-10",
    status: "Active"
  },
  {
    id: "EMP004",
    name: "Diana Wilson",
    email: "diana.wilson@company.com",
    salary: 68000,
    position: "Data Analyst",
    department: "Analytics",
    startDate: "2022-02-01",
    status: "Active"
  },
  {
    id: "EMP005",
    name: "Eve Martinez",
    email: "eve.martinez@company.com",
    salary: 77000,
    position: "UX Designer",
    department: "Design",
    startDate: "2021-09-15",
    status: "Active"
  }
];

// Mock Legacy HR System Data (intentionally has some discrepancies)
const legacyHREmployees = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    salary: 85000, // Correct
    position: "Senior Software Engineer",
    department: "Engineering",
    startDate: "2020-03-15",
    status: "Active"
  },
  {
    id: "EMP002",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    salary: 70000, // DISCREPANCY: Should be 72000
    position: "Product Manager",
    department: "Product",
    startDate: "2021-06-20",
    status: "Active"
  },
  {
    id: "EMP003",
    name: "Carol Davis",
    email: "carol.davis@company.com",
    salary: 95000,
    position: "Manager - Engineering", // DISCREPANCY: Different title
    department: "Engineering",
    startDate: "2019-01-10",
    status: "Active"
  },
  {
    id: "EMP004",
    name: "Diana Wilson",
    email: "diana.wilson@company.com",
    salary: 68000,
    position: "Data Analyst",
    department: "Data", // DISCREPANCY: Department name differs
    startDate: "2022-02-01",
    status: "Active"
  },
  {
    id: "EMP005",
    name: "Eve Martinez",
    email: "eve.martinez@company.com",
    salary: 77000,
    position: "UX Designer",
    department: "Design",
    startDate: "2021-09-15",
    status: "Inactive" // DISCREPANCY: Different status
  }
];

module.exports = {
  workdayEmployees,
  legacyHREmployees
};
