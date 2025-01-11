import ButtonRounded from '../atoms/button/ButtonRounded';

interface FloatingButtonProps {
  className?: string;
  onClick: () => void;
  text: string | JSX.Element;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function FloatingButton({
  className = '',
  onClick,
  text,
  onMouseEnter,
  onMouseLeave,
}: Readonly<FloatingButtonProps>) {
  return (
    <div
      className={`floating-button ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ButtonRounded
        text={text}
        onClick={onClick}
        className="bg-black text-white text-base font-bold py-2 px-4 rounded-full"
        variant={undefined}
      >
        {text}
      </ButtonRounded>
    </div>
  );
}
