import { useState, useEffect } from 'react';
import bus from '../../utils/bus';

function Message() {
  const [visibility, setVisibility] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    bus.addListener('flash', ({ message, type }) => {
      setVisibility(true);
      setMessage(message);
      setType(type);
      setTimeout(() => {
        setVisibility(false);
      }, 10000);
    });
  }, []);

  return (
    visibility && (
      <div
        className={`
        p-4 rounded-md shadow-md
        ${type === 'success' ? 'bg-green-100 text-green-800' : ''}
        ${type === 'error' ? 'bg-red-100 text-red-800' : ''}
        `}
      >
        {message}
      </div>
    )
  );
}
export default Message;