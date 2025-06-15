import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#28a745',
    textAlign: 'center',
  },
  dropdown: {
    marginVertical: 8,
    zIndex: 1000,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    width: 60,
    height: 35,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    marginLeft: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    marginBlockEnd: 90,
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
