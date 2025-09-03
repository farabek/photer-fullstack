import { toast } from 'react-toastify';
import { ReactElement } from 'react';
import { Alert } from './Alert';
import { Button } from '../button/Button';

const meta = {
  title: 'Components/Alert',
};

export default meta;

export const Default = {
  render: (): ReactElement => {
    return (
      <div>
        <Alert />
        <Button onClick={() => toast('Default')}>Show notification</Button>
      </div>
    );
  },
};
export const Success = {
  render: (): ReactElement => {
    return (
      <div>
        <Alert />
        <Button onClick={() => toast.success('Success')}>
          Show notification
        </Button>
      </div>
    );
  },
};
export const Warning = {
  render: (): ReactElement => {
    return (
      <div>
        <Alert />
        <Button onClick={() => toast.warn('Warning')}>Show notification</Button>
      </div>
    );
  },
};
export const Error = {
  render: (): ReactElement => {
    return (
      <div>
        <Alert />
        <Button onClick={() => toast.error('Error')}>Show notification</Button>
      </div>
    );
  },
};

export const WithContentOverflow = {
  render: (): ReactElement => {
    return (
      <div>
        <Alert autoClose={100000} />
        <Button
          onClick={() =>
            toast.error(
              'Show very long notification. More more more more more ...'
            )
          }
        >
          Show notification
        </Button>
      </div>
    );
  },
};
