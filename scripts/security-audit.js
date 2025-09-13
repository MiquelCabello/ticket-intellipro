#!/usr/bin/env node

/**
 * Security audit script for dependency scanning and vulnerability checks
 */

const { execSync } = require('child_process');
const fs = require('fs');

const CRITICAL_SEVERITIES = ['critical', 'high'];
const AUDIT_REPORT_FILE = 'security-audit-report.json';

function runAudit() {
  console.log('🔍 Running security audit...\n');

  try {
    // Run npm audit and capture output
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(auditResult);

    // Generate report
    const report = generateReport(auditData);
    
    // Save report
    fs.writeFileSync(AUDIT_REPORT_FILE, JSON.stringify(report, null, 2));
    
    // Display summary
    displaySummary(report);
    
    // Exit with error code if critical vulnerabilities found
    if (report.criticalCount > 0) {
      console.error('\n❌ Critical vulnerabilities found! Please review and fix.');
      process.exit(1);
    }
    
    console.log('\n✅ Security audit completed successfully.');
    
  } catch (error) {
    if (error.status === 1) {
      // npm audit found vulnerabilities
      try {
        const auditData = JSON.parse(error.stdout);
        const report = generateReport(auditData);
        
        fs.writeFileSync(AUDIT_REPORT_FILE, JSON.stringify(report, null, 2));
        displaySummary(report);
        
        if (report.criticalCount > 0) {
          console.error('\n❌ Critical vulnerabilities found! Please review and fix.');
          process.exit(1);
        }
      } catch (parseError) {
        console.error('Failed to parse audit output:', parseError.message);
        process.exit(1);
      }
    } else {
      console.error('Audit failed:', error.message);
      process.exit(1);
    }
  }
}

function generateReport(auditData) {
  const vulnerabilities = auditData.vulnerabilities || {};
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0
    },
    criticalVulnerabilities: [],
    recommendations: []
  };

  // Process vulnerabilities
  Object.entries(vulnerabilities).forEach(([package, vuln]) => {
    const severity = vuln.severity;
    report.summary.total++;
    
    if (severity in report.summary) {
      report.summary[severity]++;
    }

    // Track critical vulnerabilities
    if (CRITICAL_SEVERITIES.includes(severity)) {
      report.criticalVulnerabilities.push({
        package,
        severity,
        title: vuln.title,
        url: vuln.url,
        range: vuln.range,
        fixAvailable: vuln.fixAvailable
      });
    }
  });

  // Generate recommendations
  report.recommendations = generateRecommendations(report);
  report.criticalCount = report.summary.critical + report.summary.high;

  return report;
}

function generateRecommendations(report) {
  const recommendations = [];

  if (report.criticalCount > 0) {
    recommendations.push('🚨 URGENT: Fix critical/high severity vulnerabilities immediately');
    recommendations.push('Run `npm audit fix` to auto-fix compatible issues');
    recommendations.push('Review each vulnerability manually for breaking changes');
  }

  if (report.summary.moderate > 0) {
    recommendations.push('⚠️  Schedule fixes for moderate severity vulnerabilities');
  }

  recommendations.push('🔄 Run security audits regularly as part of CI/CD');
  recommendations.push('📊 Monitor security advisories for your dependencies');

  return recommendations;
}

function displaySummary(report) {
  console.log('📊 Security Audit Summary:');
  console.log('=' * 40);
  console.log(`Total vulnerabilities: ${report.summary.total}`);
  console.log(`Critical: ${report.summary.critical}`);
  console.log(`High: ${report.summary.high}`);
  console.log(`Moderate: ${report.summary.moderate}`);
  console.log(`Low: ${report.summary.low}`);
  console.log(`Info: ${report.summary.info}`);

  if (report.criticalVulnerabilities.length > 0) {
    console.log('\n🚨 Critical Vulnerabilities:');
    console.log('-' * 30);
    report.criticalVulnerabilities.forEach(vuln => {
      console.log(`• ${vuln.package} (${vuln.severity}): ${vuln.title}`);
    });
  }

  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    console.log('-' * 20);
    report.recommendations.forEach(rec => {
      console.log(`• ${rec}`);
    });
  }

  console.log(`\n📄 Full report saved to: ${AUDIT_REPORT_FILE}`);
}

// Run if called directly
if (require.main === module) {
  runAudit();
}

module.exports = { runAudit, generateReport };