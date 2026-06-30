import { Button, Input } from '@toyu-ui/solid';

export function App() {
  return (
    <main>
      <h1>TYUI Solid Example</h1>
      <div style={{ display: 'flex', gap: '12px', 'align-items': 'center' }}>
        <Input name="query" placeholder="Search components" type="search" />
        <Button appearance="primary">Search</Button>
      </div>
    </main>
  );
}
