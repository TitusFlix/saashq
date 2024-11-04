import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    // display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'right',
    fontSize: 12,
  },
});

interface SalesPDFProps {
  salesData: any[];
  total: number;
  startDate: Date;
  endDate: Date;
}

const SalesPDF: React.FC<SalesPDFProps> = ({
  salesData,
  total,
  startDate,
  endDate,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Sales Report</Text>
      <Text>
        Period: {startDate.toLocaleDateString()} -{' '}
        {endDate.toLocaleDateString()}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Date</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Product</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Quantity</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
        </View>
        {salesData.map((sale, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Date(sale.date1).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{sale.product}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{sale.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>${sale.amount.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>Total: ${total.toFixed(2)}</Text>
    </Page>
  </Document>
);

export default SalesPDF;
