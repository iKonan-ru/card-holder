export interface IUpdateModalProps {
  onUpdate: () => Promise<void>;
  onDismiss?: () => void;
}
