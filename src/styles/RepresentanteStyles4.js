import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  dropdown: {
    marginBottom: 15,
  },
  dropdownContainer: {
    backgroundColor: '#fafafa',
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 14,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  noDataText: {
    padding: 10,
    fontStyle: 'italic',
    color: '#777',
    flex: 1,
  },
});
