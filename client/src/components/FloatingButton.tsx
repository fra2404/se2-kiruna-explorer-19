import { ButtonRounded } from './Button';

interface FloatingButtonProps {
    onClick: () => void;
    text: string;
}

export default function FloatingButton({ onClick, text }: FloatingButtonProps) {
    return (
        <div style={{ position: "fixed", top: "50%", right: "1rem", transform: "translateY(-50%)", zIndex: 1000 }}>
            <ButtonRounded text={text} onClick={onClick} className="bg-black text-white text-base font-bold py-2 px-4 rounded-full">
            </ButtonRounded>
        </div>
    );
};