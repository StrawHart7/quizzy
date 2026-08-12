import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title,
  subtitle,
  header,
  footer,
  onClick
}) => {
  return (
    <div 
      className={`card ${className} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      {(title || subtitle || header) && (
        <div className="card-header">
          <div>
            {title && <h3 className="text-lg font-semibold text-[#0f172a] dark:text-[#e8e8f0]">{title}</h3>}
            {subtitle && <p className="text-sm text-[#64748b] dark:text-[#6b6b85]">{subtitle}</p>}
          </div>
          {header && <div>{header}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};