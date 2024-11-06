import { Button } from '@material-tailwind/react';
import { variant } from '@material-tailwind/react/types/components/button';
import { Col, Row } from 'react-bootstrap';
//import Logo from '../assets/icons/logo'; // The SVG is not rendered correctly

interface ButtonRoundedProps {
    img?: string;
    className?: string;
    variant: variant;
    text?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}


export function ButtonRounded(props: ButtonRoundedProps) {
    const className = props.className + ' rounded-full';
    return (
        <div>
            {props.img ? (
                <Button
                    variant={props.variant}
                    onClick={props.onClick}
                    className={className}
                    style={props.style}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    <Row>
                        <Col xs="auto" className="p-0">
                            <img
                                src={props.img}
                                alt={props.text}
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            />
                            {/* <Logo></Logo> */}
                        </Col>
                        <Col className="d-flex align-items-center">{props.text}</Col>
                    </Row>
                    {/* <img src={props.img} alt={props.text} style={{ width: "1.5rem", height: "1.5rem", marginLeft: "0.5rem" }} /> */}
                </Button>
            ) : (
                <Button
                    variant={props.variant}
                    onClick={props.onClick}
                    className={className}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {props.text}
                </Button>
            )}
        </div>
    );
}
