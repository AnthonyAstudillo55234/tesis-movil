import { StyleSheet } from 'react-native';

const RepresentanteStyles2 = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#28a745',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  cellText: {
    fontSize: 17,
    textAlign: 'center',
    flex: 1,
  },
});

export default RepresentanteStyles2;

