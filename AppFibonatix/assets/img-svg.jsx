import * as React from "react"
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg"

export const Joystick = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={38}
    height={45}
    fill="none"
    {...props}
  >
    <Path
      fill="#CBEFD5"
      d="M16.667 15.59v-.911c-1.528-.465-2.778-1.349-3.75-2.652-.973-1.304-1.459-2.813-1.459-4.527 0-2.071.712-3.84 2.136-5.304C15.017.732 16.736 0 18.75 0s3.733.732 5.156 2.196C25.33 3.661 26.042 5.43 26.042 7.5c0 1.714-.486 3.223-1.459 4.527-.972 1.303-2.222 2.187-3.75 2.652v.91l14.584 8.625a4.14 4.14 0 0 1 1.536 1.58c.365.661.547 1.385.547 2.17v4.072c0 .785-.182 1.509-.547 2.17a4.14 4.14 0 0 1-1.536 1.58L20.833 44.41a4.01 4.01 0 0 1-2.083.59 4.01 4.01 0 0 1-2.083-.59L2.083 35.787a4.14 4.14 0 0 1-1.536-1.58A4.417 4.417 0 0 1 0 32.035v-4.072c0-.785.182-1.509.547-2.17a4.14 4.14 0 0 1 1.536-1.58l14.584-8.625Zm0 12.267v-7.34l-8.75 5.197 10.833 6.429 10.833-6.429-8.75-5.196v7.34h-4.166Z"
    />
  </Svg>
)

export const UtenciliosVerdes = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={35}
      height={39}
      fill="none"
      {...props}
    >
      <Path
        fill="#0C5206"
        d="M15.556 13.65h-3.89V0H7.779v13.65h-3.89V0H0v13.65c0 4.134 3.228 7.488 7.292 7.742V39h4.86V21.392c4.065-.254 7.292-3.608 7.292-7.742V0h-3.888v13.65Zm9.722-5.85v15.6h4.86V39H35V0c-5.367 0-9.722 4.368-9.722 7.8Z"
      />
    </Svg>
  )

  export const CirculoVerde = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={62}
      height={62}
      fill="none"
      {...props}
    >
      <Path
        fill="#0C5206"
        d="M62 31c0 17.12-13.88 31-31 31C13.88 62 0 48.12 0 31 0 13.88 13.88 0 31 0c17.12 0 31 13.88 31 31Z"
      />
    </Svg>
  )

  export const LunaVerde = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={98}
      height={55}
      fill="none"
      {...props}
    >
      <Path
        fill="#0C5206"
        d="M49.475 48.75c-3.046 0-5.901-.58-8.567-1.742-2.665-1.16-4.986-2.73-6.962-4.708-1.977-1.977-3.545-4.3-4.705-6.966-1.16-2.668-1.741-5.525-1.741-8.573 0-4.5 1.242-8.581 3.726-12.246 2.484-3.665 5.811-6.35 9.981-8.056a3.573 3.573 0 0 1 1.578-.19c.544.054.997.227 1.36.517.29.254.516.608.68 1.061.163.454.244 1.043.244 1.77a22.468 22.468 0 0 0 1.74 8.19 21.504 21.504 0 0 0 4.679 6.94 21.408 21.408 0 0 0 6.962 4.681 22.65 22.65 0 0 0 8.214 1.742c.761 0 1.341.063 1.74.19.4.127.726.336.98.626.29.363.48.835.57 1.415.091.58.046 1.107-.135 1.579-1.668 4.173-4.352 7.51-8.05 10.015-3.7 2.503-7.797 3.755-12.294 3.755Zm10.172-32.113-3.808-1.741c-.435-.182-.652-.508-.652-.98s.217-.798.652-.98l3.808-1.741 1.74-3.81c.182-.436.508-.654.98-.654.471 0 .797.218.979.654l1.74 3.81 3.808 1.741c.435.182.653.508.653.98s-.218.798-.653.98l-3.808 1.741-1.74 3.81c-.181.436-.508.654-.98.654-.47 0-.797-.218-.978-.654l-1.741-3.81Z"
      />
    </Svg>
  )

  export const UtenciliosAzules = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={35}
      height={39}
      fill="none"
      {...props}
    >
      <Path
        fill="#0F51BB"
        d="M15.556 13.611h-3.89V0H7.779v13.611h-3.89V0H0v13.611c0 4.122 3.228 7.467 7.292 7.72v17.558h4.86V21.33c4.065-.253 7.292-3.598 7.292-7.72V0h-3.888v13.611Zm9.722-5.833v15.555h4.86V38.89H35V0c-5.367 0-9.722 4.356-9.722 7.778Z"
      />
    </Svg>
  )

  export const JoystickAzul = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={38}
      height={44}
      fill="none"
      {...props}
    >
      <Path
        fill="#0F51BB"
        d="M16.667 15.156v-.885a7.178 7.178 0 0 1-3.75-2.578c-.973-1.268-1.459-2.735-1.459-4.401 0-2.014.712-3.733 2.136-5.157C15.017.712 16.736 0 18.75 0s3.733.712 5.156 2.135c1.424 1.424 2.136 3.143 2.136 5.157 0 1.666-.486 3.133-1.459 4.4a7.178 7.178 0 0 1-3.75 2.579v.885l14.584 8.386a4.08 4.08 0 0 1 1.536 1.536 4.2 4.2 0 0 1 .547 2.11v3.958a4.2 4.2 0 0 1-.547 2.11 4.08 4.08 0 0 1-1.536 1.536l-14.584 8.385a4.096 4.096 0 0 1-2.083.573 4.09 4.09 0 0 1-2.083-.573L2.083 34.792a4.08 4.08 0 0 1-1.536-1.537A4.2 4.2 0 0 1 0 31.145v-3.957a4.2 4.2 0 0 1 .547-2.11 4.08 4.08 0 0 1 1.536-1.536l14.584-8.386Zm0 11.927v-7.135L7.917 25l10.833 6.25L29.583 25l-8.75-5.052v7.135h-4.166Z"
      />
    </Svg>
  )

  export const LunaAzul = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={98}
      height={55}
      fill="none"
      {...props}
    >
      <Path
        fill="#BCDDF4"
        d="M49.475 48.75c-3.046 0-5.901-.58-8.567-1.742-2.665-1.16-4.986-2.73-6.962-4.708-1.977-1.977-3.545-4.3-4.705-6.966-1.16-2.668-1.741-5.525-1.741-8.573 0-4.5 1.242-8.581 3.726-12.246 2.484-3.665 5.811-6.35 9.981-8.056a3.573 3.573 0 0 1 1.578-.19c.544.054.997.227 1.36.517.29.254.516.608.68 1.061.163.454.244 1.043.244 1.77a22.468 22.468 0 0 0 1.74 8.19 21.504 21.504 0 0 0 4.679 6.94 21.408 21.408 0 0 0 6.962 4.681 22.65 22.65 0 0 0 8.214 1.742c.761 0 1.341.063 1.74.19.4.127.726.336.98.626.29.363.48.835.57 1.415.091.58.046 1.107-.135 1.579-1.668 4.173-4.352 7.51-8.05 10.015-3.7 2.503-7.797 3.755-12.294 3.755Zm10.172-32.113-3.808-1.741c-.435-.182-.652-.508-.652-.98s.217-.798.652-.98l3.808-1.741 1.74-3.81c.182-.436.508-.654.98-.654.471 0 .797.218.979.654l1.74 3.81 3.808 1.741c.435.182.653.508.653.98s-.218.798-.653.98l-3.808 1.741-1.74 3.81c-.181.436-.508.654-.98.654-.47 0-.797-.218-.978-.654l-1.741-3.81Z"
      />
    </Svg>
  )

  export const CirculoAzul = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={62}
      height={62}
      fill="none"
      {...props}
    >
      <Path
        fill="#0F51BB"
        d="M62 31c0 17.12-13.88 31-31 31C13.88 62 0 48.12 0 31 0 13.88 13.88 0 31 0c17.12 0 31 13.88 31 31Z"
      />
    </Svg>
  )

  export const UtenciliosNaranjas = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={35}
      height={39}
      fill="none"
      {...props}
    >
      <Path
        fill="#FEE6C4"
        d="M15.556 13.65h-3.89V0H7.779v13.65h-3.89V0H0v13.65c0 4.134 3.228 7.488 7.292 7.742V39h4.86V21.392c4.065-.254 7.292-3.608 7.292-7.742V0h-3.888v13.65Zm9.722-5.85v15.6h4.86V39H35V0c-5.367 0-9.722 4.368-9.722 7.8Z"
      />
    </Svg>
  )

  export const JoystickNaranja = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={38}
      height={44}
      fill="none"
      {...props}
    >
      <Path
        fill="#CA4616"
        d="M16.667 15.156v-.885a7.178 7.178 0 0 1-3.75-2.578c-.973-1.268-1.459-2.735-1.459-4.401 0-2.014.712-3.733 2.136-5.157C15.017.712 16.736 0 18.75 0s3.733.712 5.156 2.135c1.424 1.424 2.136 3.143 2.136 5.157 0 1.666-.486 3.133-1.459 4.4a7.178 7.178 0 0 1-3.75 2.579v.885l14.584 8.386a4.08 4.08 0 0 1 1.536 1.536 4.2 4.2 0 0 1 .547 2.11v3.958a4.2 4.2 0 0 1-.547 2.11 4.08 4.08 0 0 1-1.536 1.536l-14.584 8.385a4.096 4.096 0 0 1-2.083.573 4.09 4.09 0 0 1-2.083-.573L2.083 34.792a4.08 4.08 0 0 1-1.536-1.537A4.2 4.2 0 0 1 0 31.145v-3.957a4.2 4.2 0 0 1 .547-2.11 4.08 4.08 0 0 1 1.536-1.536l14.584-8.386Zm0 11.927v-7.135L7.917 25l10.833 6.25L29.583 25l-8.75-5.052v7.135h-4.166Z"
      />
    </Svg>
  )

  export const LunaNaranja = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={43}
    height={43}
    fill="none"
    {...props}
  >
    <Path
      fill="#CA4616"
      d="M21.975 42.474c-3.046 0-5.902-.58-8.567-1.741-2.665-1.16-4.986-2.729-6.962-4.705C4.469 34.05 2.9 31.73 1.74 29.065.58 26.4 0 23.545 0 20.498c0-4.496 1.242-8.576 3.726-12.238C6.21 4.597 9.537 1.914 13.707.21a3.575 3.575 0 0 1 1.578-.191c.544.054.997.226 1.36.517.29.253.516.607.68 1.06.163.454.244 1.043.244 1.768a22.442 22.442 0 0 0 1.74 8.186 21.49 21.49 0 0 0 4.679 6.936 21.41 21.41 0 0 0 6.962 4.678 22.663 22.663 0 0 0 8.214 1.74c.761 0 1.341.064 1.74.19.4.127.726.336.98.626.29.363.48.834.57 1.414.091.58.046 1.106-.135 1.578-1.668 4.17-4.352 7.506-8.05 10.008-3.7 2.502-7.797 3.754-12.294 3.754ZM32.147 10.38l-3.808-1.74c-.435-.182-.652-.508-.652-.98 0-.471.217-.798.652-.979l3.808-1.74 1.74-3.808c.182-.435.508-.653.98-.653.471 0 .797.218.979.653l1.74 3.807 3.808 1.741c.435.181.653.508.653.98 0 .47-.218.797-.653.978l-3.808 1.74-1.74 3.808c-.181.436-.508.653-.98.653-.47 0-.797-.217-.978-.652l-1.741-3.808Z"
    />
    </Svg>
  )

  export const CirculoNaranja = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={98}
      height={55}
      fill="none"
      {...props}
    >
      <Path
        fill="#CA4616"
        d="M48.975 48.474c-3.046 0-5.901-.58-8.567-1.741-2.665-1.16-4.986-2.729-6.962-4.705-1.977-1.977-3.545-4.297-4.705-6.963C27.58 32.4 27 29.545 27 26.498c0-4.496 1.242-8.576 3.726-12.238 2.484-3.663 5.811-6.346 9.981-8.05a3.575 3.575 0 0 1 1.578-.191c.544.054.997.226 1.36.517.29.253.516.607.68 1.06.163.454.244 1.043.244 1.768a22.442 22.442 0 0 0 1.74 8.186 21.49 21.49 0 0 0 4.679 6.936 21.41 21.41 0 0 0 6.962 4.678 22.663 22.663 0 0 0 8.214 1.74c.761 0 1.341.064 1.74.19.4.127.726.336.98.626.29.363.48.834.57 1.414.091.58.046 1.106-.135 1.578-1.668 4.17-4.352 7.506-8.05 10.008-3.7 2.502-7.797 3.754-12.294 3.754ZM59.147 16.38l-3.808-1.74c-.435-.182-.652-.508-.652-.98 0-.471.217-.798.652-.979l3.808-1.74 1.74-3.808c.182-.435.508-.653.98-.653.471 0 .797.218.979.653l1.74 3.807 3.808 1.741c.435.181.653.508.653.98 0 .47-.218.797-.653.978l-3.808 1.74-1.74 3.809c-.181.435-.508.652-.98.652-.47 0-.797-.217-.978-.652l-1.741-3.808Z"
      />
    </Svg>
  )

  export const LogoFibonatix = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={48} height={1} {...props}>
      <Path fill="#063855" fillRule="evenodd" d="M0 0h48v1H0z" />
    </Svg>
  )

  export const FaceA = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={34}
      height={29}
      fill="none"
      {...props}
    >
      <Path
        fill="#000"
        d="M5.424 10.768a5.03 5.03 0 1 0 0-10.062 5.03 5.03 0 0 0 0 10.062Zm23.142 0a5.03 5.03 0 1 0 0-10.062 5.03 5.03 0 0 0 0 10.062Zm1.091 8.741c-8.16 5.69-17.212 5.657-25.323 0-.976-.681-1.857.498-1.195 1.587 2.473 4.073 7.463 7.698 13.856 7.698s11.383-3.627 13.856-7.698c.662-1.09-.218-2.267-1.194-1.587Z"
      />
    </Svg>
  )

  export const FaceB = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={38}
      height={29}
      fill="none"
      {...props}
    >
      <Path
        fill="#000"
        d="M6.259 11.606a5.522 5.522 0 1 0 0-11.044 5.522 5.522 0 0 0 0 11.044Zm25.399 0a5.522 5.522 0 1 0 0-11.044 5.522 5.522 0 0 0 0 11.044Zm-5.11 12.599h-15.18c-1.66 0-1.66 4.418 0 4.418h15.18c1.66 0 1.66-4.418 0-4.418Z"
      />
    </Svg>
  )

  export const FaceC = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={38}
      height={30}
      fill="none"
      {...props}
    >
      <Path
        fill="#000"
        d="M6.259 11.916a5.522 5.522 0 1 0 0-11.043 5.522 5.522 0 0 0 0 11.043Zm25.399 0a5.522 5.522 0 1 0 0-11.044 5.522 5.522 0 0 0 0 11.044Zm-12.7 9.058c-5.012 0-8.925 3.377-10.862 7.168-.52 1.014.17 2.113.937 1.48 6.397-5.302 13.493-5.269 19.852 0 .766.633 1.456-.466.937-1.48-1.938-3.791-5.853-7.168-10.864-7.168Z"
      />
    </Svg>
  )

  export const FaceD = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={47}
      height={30}
      fill="none"
      {...props}
    >
      <Path
        fill="#000"
        d="M17.275 8.552c-.85-1.823-13.45 4.052-12.6 5.875 1.34 2.871 5.246 3.884 8.725 2.262 3.478-1.624 5.213-5.266 3.875-8.137Zm12.72 0c-1.339 2.871.397 6.511 3.875 8.137 3.478 1.62 7.384.61 8.724-2.262.85-1.823-11.75-7.698-12.6-5.875ZM16.177 1.524C16.622.98 14.885-.308 14.52.144c-2.67 3.204-9.095 6.2-13.266 6.186-.58-.013-.712 2.147-.005 2.155 4.81.017 11.845-3.263 14.93-6.96ZM46.014 6.33c-4.17.013-10.596-2.983-13.265-6.185-.365-.453-2.102.835-1.658 1.38 3.085 3.697 10.119 6.977 14.928 6.96.707-.009.576-2.168-.005-2.155Zm-13.93 20.02c-5.32-2.5-11.606-2.501-16.932-.012-1.318.635.324 4.086 1.637 3.446 3.516-1.64 8.759-2.27 13.661.01 1.313.61 3.03-2.77 1.633-3.444Z"
      />
    </Svg>
  )