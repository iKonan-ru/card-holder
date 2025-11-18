export interface IPasswordToggleButtonProps {
  ariaLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
  onToggle: () => void;
}
