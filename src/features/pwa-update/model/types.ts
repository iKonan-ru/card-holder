export interface IPWAUpdateProps {
  onUpdate: () => Promise<void>;
  onDismiss?: () => void;
}
