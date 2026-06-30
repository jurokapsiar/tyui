import { defineTyuiButton } from '@toyu-ui/define/button';
import './styles.css';

defineTyuiButton();

const button = document.getElementById('button');
const status = document.getElementById('status');

button?.addEventListener('click', () => {
  if (status) {
    status.textContent = 'Status: clicked';
  }
});
