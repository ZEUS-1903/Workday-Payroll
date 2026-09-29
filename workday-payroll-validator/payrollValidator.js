/**
 * Payroll Validator Module
 * Compares Workday data against Legacy HR System data
 */

class PayrollValidator {
  constructor(workdayData, legacyData) {
    this.workdayData = workdayData;
    this.legacyData = legacyData;
    this.discrepancies = [];
  }

  /**
   * Validate all employee records
   */
  validateAll() {
    this.discrepancies = [];

    // Check each employee in Workday
    for (const workdayEmp of this.workdayData) {
      const legacyEmp = this.legacyData.find(e => e.id === workdayEmp.id);

      if (!legacyEmp) {
        this.addDiscrepancy({
          employeeId: workdayEmp.id,
          employeeName: workdayEmp.name,
          type: "MISSING_IN_LEGACY",
          field: "entire_record",
          workdayValue: "Record exists",
          legacyValue: "Record missing",
          severity: "HIGH"
        });
      } else {
        this.validateEmployee(workdayEmp, legacyEmp);
      }
    }

    // Check for employees in Legacy that don't exist in Workday
    for (const legacyEmp of this.legacyData) {
      const workdayEmp = this.workdayData.find(e => e.id === legacyEmp.id);

      if (!workdayEmp) {
        this.addDiscrepancy({
          employeeId: legacyEmp.id,
          employeeName: legacyEmp.name,
          type: "EXTRA_IN_LEGACY",
          field: "entire_record",
          workdayValue: "Record missing",
          legacyValue: "Record exists",
          severity: "MEDIUM"
        });
      }
    }

    return this.getResults();
  }

  /**
   * Validate individual employee fields
   */
  validateEmployee(workdayEmp, legacyEmp) {
    const fieldsToCheck = ['name', 'email', 'salary', 'position', 'department', 'status'];

    for (const field of fieldsToCheck) {
      const workdayValue = workdayEmp[field];
      const legacyValue = legacyEmp[field];

      if (workdayValue !== legacyValue) {
        let severity = "LOW";
        if (field === "salary") severity = "HIGH"; // Salary mismatches are critical
        if (field === "status") severity = "MEDIUM"; // Status changes matter
        if (field === "position" || field === "department") severity = "MEDIUM";

        this.addDiscrepancy({
          employeeId: workdayEmp.id,
          employeeName: workdayEmp.name,
          type: "VALUE_MISMATCH",
          field: field,
          workdayValue: workdayValue,
          legacyValue: legacyValue,
          severity: severity
        });
      }
    }
  }

  /**
   * Add a discrepancy to the results
   */
  addDiscrepancy(discrepancy) {
    this.discrepancies.push(discrepancy);
  }

  /**
   * Get validation results with summary
   */
  getResults() {
    const highSeverity = this.discrepancies.filter(d => d.severity === "HIGH").length;
    const mediumSeverity = this.discrepancies.filter(d => d.severity === "MEDIUM").length;
    const lowSeverity = this.discrepancies.filter(d => d.severity === "LOW").length;

    return {
      summary: {
        totalEmployees: this.workdayData.length,
        discrepanciesFound: this.discrepancies.length,
        bySeverity: {
          high: highSeverity,
          medium: mediumSeverity,
          low: lowSeverity
        },
        overallStatus: this.discrepancies.length === 0 ? "PASS" : "FAIL"
      },
      discrepancies: this.discrepancies.sort((a, b) => {
        const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      })
    };
  }
}

module.exports = PayrollValidator;
