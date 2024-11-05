import { Button } from '@material-tailwind/react';

//const { isLoggedIn, user } = useAuth();   // Retrieve this information from the context created by FAL
import { Col, Row } from 'react-bootstrap';
import Logo from '../assets/icons/logo'; // The SVG is not rendered correctly

export function ButtonRounded(props: any) {
  const className = props.className + ' rounded-full';
  return (
    <div>
      {props.img ? (
        <Button
          variant={props.variant}
          onClick={props.onClick}
          className={className}
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
        >
          {props.text}
        </Button>
      )}
    </div>
  );
}
