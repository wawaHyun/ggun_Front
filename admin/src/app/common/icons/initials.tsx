import React from 'react';

interface InitialsProps {
  initials: string;
  size: number;
}

const Initials: React.FC<InitialsProps> = ({ initials, size }) => {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size / 2,
    fontWeight: 'bold',
  };

  return <div style={style}>{initials}</div>;
};

export default Initials;