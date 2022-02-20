import { ReportService } from './../report/report.service';
import { Injectable } from '@nestjs/common';
import { ReportType } from 'src/data';

@Injectable()
export class SummaryService {
  constructor(private readonly reportService: ReportService) {}
  calculateSummary() {
    const totalExpenses = this.reportService
      .getAllReports(ReportType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncome = this.reportService
      .getAllReports(ReportType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
    };
  }
}
