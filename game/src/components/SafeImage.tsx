import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import styles from "./SafeImage.module.css";

export function SafeImage({ src, alt, onError, ...props }: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const failed = failedSrc === src;
  const fallbackLabel = `场景图片未能加载：${alt}`;

  return (
    <>
      <Image
        {...props}
        src={src}
        alt={alt}
        hidden={failed}
        aria-hidden={failed || undefined}
        onError={(event) => {
          setFailedSrc(src);
          onError?.(event);
        }}
      />
      {failed ? (
        <span
          className={styles.visuallyHidden}
          role="img"
          aria-label={fallbackLabel}
        >
          {fallbackLabel}
        </span>
      ) : null}
    </>
  );
}
