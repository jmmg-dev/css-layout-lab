import styles from './diagrams.module.css';

export function BoxDiagram() {
  return (
    <div className={styles.box} aria-hidden="true">
      <div className={styles.margin}>
        <span>margin</span>
        <div className={styles.border}>
          <span>border</span>
          <div className={styles.padding}>
            <span>padding</span>
            <div className={styles.content}>
              <span>content</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContainerDiagram({ container, child }: { container: string; child: string }) {
  return (
    <div className={styles.container} aria-hidden="true">
      <span>{container}</span>
      <div className={styles.containerBody}>
        {[1, 2, 3].map((id) => (
          <div key={id} className="brick-surface">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
