import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#28a745',
    height: 180,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  userName: {
    color: '#fff',
    fontSize: 25,
    marginTop: 10,
    fontWeight: '600',
  },
  menuContainer: {
    padding: 20,
    gap: 26,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 20,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#28a745',
    marginVertical: 30,
    marginHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
