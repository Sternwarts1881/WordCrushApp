import {StyleSheet} from 'react-native'

export const colors = {
  background: '#F5F5DC', // Arka plan için açık bir bej tonu
  textPrimary: '#333',
  textSecondary: '#555',
  surface: '#FFFFFF',
  border: '#CCCCCC',
  primary: '#4CAF50',
  primaryText: '#FFFFFF',
  badgeBackground: '#E0E0E0',
  accent: '#FF5722',
  menuButton: '#2196F3',
  shadow: '#000000',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: colors.background,
    color: 'black'
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    backgroundColor: colors.badgeBackground,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.accent,
    marginBottom: 50,
    letterSpacing: 2,
  },
  menuButton: {
    backgroundColor: colors.menuButton,
    width: '80%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButtonText: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: 'bold',
  },
});