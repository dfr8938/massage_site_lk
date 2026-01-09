// client/src/components/Buttons.jsx
import { Button } from 'primereact/button';
import styles from './Buttons.module.css';

/**
 * Основная кнопка (заливка + градиент)
 */
export const ButtonPrimary = ({ label, icon, ...props }) => (
  <Button
    label={label}
    icon={icon}
    className={`${styles.primaryButton} font-medium p-button-raised`}
    {...props}
  />
);

/**
 * Вторичная кнопка (текстовая, с hover-эффектом)
 */
export const ButtonSecondary = ({ label, icon, ...props }) => (
  <Button
    label={label}
    icon={icon}
    text
    className={`${styles.secondaryButton} font-medium`}
    {...props}
  />
);
