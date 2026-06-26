import { createSignal } from 'solid-js';
import { Button } from '@tyui/solid';

export function App() {
  const [pressed, setPressed] = createSignal(false);

  return (
    <main>
      <h1>TYUI Solid Example</h1>
      <Button
        pressed={pressed()}
        onActivate={(event) => {
          setPressed(event.detail.pressed);
        }}
      >
        {pressed() ? 'Pressed' : 'Press me'}
      </Button>
      <p>Status: {pressed() ? 'active' : 'idle'}</p>
    </main>
  );
}
