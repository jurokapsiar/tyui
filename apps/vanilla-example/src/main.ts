import { defineTyuiButton } from '@tyui/define/button';
import type { TyuiButtonActivateEvent } from '@tyui/elements/button';
import './styles.css';

defineTyuiButton();

const button = document.getElementById('button');
const status = document.getElementById('status');

button?.addEventListener('activate', (event) => {
  const { pressed } = (event as TyuiButtonActivateEvent).detail;

  if (status) {
    status.textContent = `Status: ${pressed ? 'active' : 'idle'}`;
  }

  if (button) {
    button.textContent = pressed ? 'Pressed' : 'Press me';
  }
});
