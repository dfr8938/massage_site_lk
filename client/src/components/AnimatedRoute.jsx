// client/src/components/AnimatedRoute.jsx
import { CSSTransition } from 'react-transition-group';
import './AnimatedRoute.css';

const AnimatedRoute = ({ children, in: inProp }) => {
  return (
    <CSSTransition
      in={inProp}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      {children}
    </CSSTransition>
  );
};

export default AnimatedRoute;
