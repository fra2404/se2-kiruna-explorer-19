import { Button } from '@material-tailwind/react';
import { ButtonProps } from '@material-tailwind/react';
import { Col, Row } from 'react-bootstrap';

interface ButtonRoundedProps {
  img?: string;
  className?: string;
  variant: ButtonProps['variant'];
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

const ButtonRounded: React.FC<ButtonRoundedProps> = ({
  img,
  className = '',
  variant,
  text,
  onClick,
  style,
}) => {
  const buttonClassName = `${className} rounded-full`;

  return (
    <div>
      {img ? (
        <Button
          variant={variant}
          onClick={onClick}
          className={buttonClassName}
          style={style}
        >
          <Row>
            <Col xs="auto" className="p-0">
              <img
                src={img}
                alt={text}
                style={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
              {text}
            </Col>
          </Row>
        </Button>
      ) : (
        <Button
          variant={variant}
          onClick={onClick}
          className={buttonClassName}
          style={style}
        >
          {text}
        </Button>
      )}
    </div>
  );
};

export default ButtonRounded;
