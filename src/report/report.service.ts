import { Injectable } from '@nestjs/common';
import { data, ReportType } from '../data';
import { v4 as uuid } from 'uuid';
import { ReportResponseDto } from '../dtos/report.dto';

interface ReportData {
  source: string;
  amount: number;
}

interface UpdateReportData {
  source?: string;
  amount?: number;
}

@Injectable()
export class ReportService {
  getAllReports(type: ReportType): ReportResponseDto[] {
    return data.report
      .filter((report) => report.type === type)
      .map((report) => new ReportResponseDto(report));
  }

  getReportById(type: ReportType, id: string): ReportResponseDto {
    const report = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    if (!report) {
      return null;
    }

    return new ReportResponseDto(report);
  }

  createReport(
    type: ReportType,
    { source, amount }: ReportData,
  ): ReportResponseDto {
    const newData = {
      id: uuid(),
      source,
      amount,
      created_at: new Date(),
      updated_at: new Date(),
      type: type === 'income' ? ReportType.INCOME : ReportType.EXPENSE,
    };
    data.report.push(newData);

    return new ReportResponseDto(newData);
  }

  updateReport(
    id: string,
    type: ReportType,
    body: UpdateReportData,
  ): ReportResponseDto {
    const reportToUpdate = data.report.find((report) => report.id === id);

    if (!reportToUpdate) {
      return null;
    }

    const reportIndex = data.report.findIndex(
      (report) => report.id === reportToUpdate.id,
    );

    data.report[reportIndex] = {
      ...reportToUpdate,
      ...body,
      type: type === 'income' ? ReportType.INCOME : ReportType.EXPENSE,
      updated_at: new Date(),
    };

    return new ReportResponseDto(data.report[reportIndex]);
  }

  deleteReport(id: string) {
    const reportIndex = data.report.findIndex((report) => report.id === id);

    if (reportIndex === -1) {
      return null;
    }

    data.report.splice(reportIndex, 1);

    return 'Deleted Successfully';
  }
}
