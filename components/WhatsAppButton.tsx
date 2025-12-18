import React, { useState } from 'react';

const WhatsAppButton: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    // WhatsApp number with country code (Somalia +252)
    const whatsappNumber = '252617705363';
    const message = encodeURIComponent('Hello! I found your portfolio and would like to connect.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
                aria-label="Contact via WhatsApp"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated rings */}
                <div className="pulse-ring ring-1"></div>
                <div className="pulse-ring ring-2"></div>
                <div className="pulse-ring ring-3"></div>

                {/* Main button container */}
                <div className="whatsapp-button-container">
                    {/* Gradient background layer */}
                    <div className="gradient-bg"></div>

                    {/* Icon wrapper with red border */}
                    <div className="whatsapp-icon-wrapper">
                        {/* Shine effect */}
                        <div className="shine-effect"></div>

                        <svg
                            className="whatsapp-icon"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Chat bubble */}
                            <path
                                d="M30 10C18.954 10 10 18.506 10 29c0 3.313 1.044 6.394 2.817 9.013L10.5 48l10.458-2.35A19.865 19.865 0 0030 48c11.046 0 20-8.506 20-19S41.046 10 30 10z"
                                fill="#FFFFFF"
                                className="chat-bubble"
                            />
                            {/* Phone icon inside bubble */}
                            <path
                                d="M38.5 35.2c-.3.84-1.509 1.536-2.469 1.74-.663.138-1.527.249-4.437-.951-3.723-1.536-6.117-5.307-6.303-5.55-.183-.243-1.503-2.001-1.503-3.816 0-1.815.951-2.706 1.29-3.075.339-.369.753-.462 1.005-.462.252 0 .504.003.726.012.231.012.543-.087.849.798.312.903 1.065 2.601 1.158 2.79.093.189.156.411.033.654-.123.243-.186.396-.372.612-.186.216-.39.483-.558.648-.186.186-.381.387-.162.747.219.36.972 1.602 2.088 2.595 1.434 1.278 2.643 1.674 3.018 1.863.375.189.594.159.813-.096.219-.255.939-1.095 1.191-1.473.252-.378.504-.315.849-.189.345.126 2.19 1.032 2.565 1.221.375.189.624.282.714.441.09.159.09.918-.21 1.758z"
                                fill="#3b82f6"
                                className="phone-icon"
                            />
                        </svg>
                    </div>

                    {/* Tooltip */}
                    <div className={`whatsapp-tooltip ${isHovered ? 'visible' : ''}`}>
                        <span className="tooltip-text">Chat on WhatsApp</span>
                        <div className="tooltip-arrow"></div>
                    </div>
                </div>
            </a>

            <style>{`
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          display: block;
          text-decoration: none;
        }

        .whatsapp-button-container {
          position: relative;
          width: 68px;
          height: 68px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .whatsapp-float:hover .whatsapp-button-container {
          transform: scale(1.15) translateY(-4px) rotate(5deg);
        }

        .whatsapp-float:active .whatsapp-button-container {
          transform: scale(0.95) translateY(0) rotate(0deg);
        }

        /* Gradient background for depth */
        .gradient-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          opacity: 0.3;
          filter: blur(12px);
          transform: scale(1.2);
          transition: all 0.4s ease;
        }

        .whatsapp-float:hover .gradient-bg {
          opacity: 0.5;
          transform: scale(1.4);
          filter: blur(16px);
        }

        /* Main icon wrapper with blue border */
        .whatsapp-icon-wrapper {
          position: relative;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          box-shadow: 
            0 8px 24px rgba(59, 130, 246, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.15),
            inset 0 2px 4px rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #3b82f6;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        .whatsapp-float:hover .whatsapp-icon-wrapper {
          box-shadow: 
            0 12px 32px rgba(59, 130, 246, 0.6),
            0 6px 16px rgba(59, 130, 246, 0.4),
            inset 0 2px 6px rgba(255, 255, 255, 0.3);
          border-color: #2563eb;
          border-width: 5px;
        }

        /* Shine effect */
        .shine-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 70%
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .whatsapp-icon {
          width: 60px;
          height: 60px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          transition: transform 0.3s ease;
        }

        .whatsapp-float:hover .whatsapp-icon {
          transform: scale(1.05);
        }

        .chat-bubble {
          transition: transform 0.3s ease;
        }

        .phone-icon {
          animation: wiggle 1s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        .whatsapp-float:hover .phone-icon {
          animation: wiggle 0.5s ease-in-out infinite;
        }

        /* Pulsing rings */
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 3px solid #3b82f6;
          opacity: 0;
          pointer-events: none;
        }

        .ring-1 {
          width: 68px;
          height: 68px;
          animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .ring-2 {
          width: 68px;
          height: 68px;
          animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s;
        }

        .ring-3 {
          width: 68px;
          height: 68px;
          animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s;
        }

        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }

        /* Tooltip */
        .whatsapp-tooltip {
          position: absolute;
          right: calc(100% + 16px);
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
          white-space: nowrap;
        }

        .whatsapp-tooltip.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }

        .tooltip-text {
          display: block;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          letter-spacing: 0.3px;
        }

        .tooltip-arrow {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid #1f2937;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .whatsapp-float {
            bottom: 20px;
            right: 20px;
          }

          .whatsapp-button-container {
            width: 58px;
            height: 58px;
          }

          .whatsapp-icon-wrapper {
            width: 58px;
            height: 58px;
            border-width: 3px;
          }

          .whatsapp-float:hover .whatsapp-icon-wrapper {
            border-width: 4px;
          }

          .whatsapp-icon {
            width: 50px;
            height: 50px;
          }

          .ring-1, .ring-2, .ring-3 {
            width: 58px;
            height: 58px;
          }

          .whatsapp-tooltip {
            display: none;
          }
        }

        /* Accessibility - reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .whatsapp-float,
          .whatsapp-button-container,
          .whatsapp-icon-wrapper,
          .gradient-bg,
          .whatsapp-tooltip {
            transition: none;
          }

          .pulse-ring,
          .shine-effect,
          .whatsapp-phone-icon {
            animation: none;
          }
        }
      `}</style>
        </>
    );
};

export default WhatsAppButton;
