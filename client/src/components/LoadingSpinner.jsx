// client/src/components/LoadingSpinner.jsx
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth="4"
        fill="none"
        animationDuration=".8s"
      />
    </div>
  );
};

export default LoadingSpinner;
