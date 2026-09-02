import { sceneAssets } from "@/content/assets";
import { SafeImage } from "./SafeImage";
import styles from "./TitleScreen.module.css";

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <section className={styles.screen} aria-labelledby="game-title">
      <div
        className={styles.backdrop}
        style={{ background: sceneAssets.birth.fallback }}
      >
        <SafeImage
          className={styles.image}
          src={sceneAssets.birth.src}
          alt="海岚市新生儿智能监护室"
          fill
          sizes="100vw"
          preload
        />
      </div>
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.eyebrow}>一场跨越百年的互动叙事</p>
        <h1 id="game-title">《余生协议：一个普通人的100年》</h1>
        <p className={styles.premise}>
          从出生协议到生命终点，你替林一走过一个普通人的一百年。
        </p>
        <button
          className={styles.start}
          type="button"
          data-testid="start-game"
          onClick={onStart}
        >
          开始这一生
        </button>
        <p className={styles.note}>
          内容提示：本作涉及 AI、数据权、资源分配与生命终点议题。
        </p>
      </div>
    </section>
  );
}
