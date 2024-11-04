'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { columns } from '../sales/table-components/columns';
import { SalesDataTable } from '../sales/table-components/data-table';
import { DatePicker } from './DatePicker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import SalesPDF from './SalesPDF';

const SalesView = ({ branchData }: { branchData: any }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [branch, setBranch] = useState<Number>(0);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDateString = formatDate(startDate);
      const endDateString = formatDate(endDate);

      try {
        const response = await axios.get('/api/sales', {
          params: {
            startDate: startDateString,
            endDate: endDateString,
            branch: branch,
          },
        });
        setSalesData(response.data);
      } catch (err) {
        console.error('Error fetching sales data:', err);
        setError('Failed to fetch sales data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [startDate, endDate, isMounted, branch]);

  if (!isMounted) {
    return null;
  }

  const total = salesData.reduce((acc, sale) => acc + sale.amount, 0);

  const selectedBranch = branchData.find((b: any) => b.branch_id === branch);
  const branchName = selectedBranch ? selectedBranch.name : 'All Branches';

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <div className="flex flex-col">
            <label
              htmlFor="companySelect"
              className="bold mb-1 text-sm font-medium italic"
            >
              Start Date
            </label>
            <DatePicker
              date={startDate}
              setDate={(date) => date && setStartDate(date)}
              label="Start Date"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="companySelect"
              className="bold mb-1 text-sm font-medium italic"
            >
              End Date
            </label>
            <DatePicker
              date={endDate}
              setDate={(date) => date && setEndDate(date)}
              label="End Date"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="companySelect"
              className="bold mb-1 text-sm font-medium italic"
            >
              Company
            </label>
            <select
              id="companySelect"
              className="rounded border p-2"
              value={String(branch)}
              onChange={(e) => {
                setBranch(Number(e.target.value));
              }}
            >
              <option value={0}>All</option>
              {branchData.map((value: any) => (
                <option key={value.branch_id} value={value.branch_id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="companySelect"
              className="bold mb-1 text-sm font-medium italic"
            >
              Sale Type
            </label>
            <select
              id="companySelect"
              className="rounded border p-2"
              value={String(branch)}
              onChange={(e) => {
                setBranch(Number(e.target.value));
              }}
            >
              <option value={0}>All</option>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading sales data...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : salesData.length === 0 ? (
          <Alert>
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>
              No sales data found for the selected date range.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <SalesDataTable data={salesData} columns={columns} total={total} />

            <div className="mt-4 flex space-x-2">
              <PDFDownloadLink
                document={
                  <SalesPDF
                    salesData={salesData}
                    total={total}
                    startDate={startDate}
                    endDate={endDate}
                  />
                }
                fileName={`sales_report_${branchName.toLowerCase().replace(/\s+/g, '_')}.pdf`}
              ></PDFDownloadLink>

              <Button onClick={() => setShowPDFPreview(!showPDFPreview)}>
                <Eye className="mr-2 h-4 w-4" />
                {showPDFPreview ? 'Hide Preview' : 'Preview PDF'}
              </Button>
            </div>

            {showPDFPreview && (
              <div className="mt-4" style={{ height: '600px' }}>
                <PDFViewer width="100%" height="100%" className="rounded-md">
                  <SalesPDF
                    salesData={salesData}
                    total={total}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </PDFViewer>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesView;
