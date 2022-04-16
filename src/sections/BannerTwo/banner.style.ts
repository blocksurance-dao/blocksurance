import styled from "styled-components";

const BannerWrapper = styled.div`
  position: relative;
  // overflow: hidden;
  // padding: 0px 0 150px 45px;
  // max-height: 400px
  z-index: 2;

  .banner__thumb {
    position: absolute;
    right: 80px;
    top: 10px;
    width: 40%;
    z-index: 2;
  }

  .banner-content {
    .heading {
      margin: 0 0 38px 0;
      font-size: 46px;
      line-height: 75px;
      font-weight: 900;
      position: relative;
      z-index: 2;
    }

    .text {
      margin-bottom: 55px;
      position: relative;
      z-index: 2;
    }

    .banner-btn {
      margin-top: 45px;
      a {
        width: 235px;
        font-size: 16px;
        color: #ffffff;
        padding: 18px 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;

        svg {
          margin-right: 10px;
        }
      }

      .btn-fill {
        transition: all 0.3s ease-in;
        background: rgb(37, 42, 213);
        background: linear-gradient(
          93deg,
          rgba(37, 42, 213, 1) 0%,
          rgba(122, 49, 222, 1) 52%,
          rgba(196, 56, 231, 1) 100%
        );
        &:hover {
          background: linear-gradient(
            93deg,
            rgba(196, 56, 231, 1) 0%,
            rgba(122, 49, 222, 1) 52%,
            rgba(37, 42, 213, 1) 100%
          );
        }
      }
    }

    .coin-info {
      display: flex;
      align-items: center;
      // padding: 140px 0 0 0;
      div {
        display: flex;
        align-items: center;
        

        .text {
          margin: 0;
          margin-right: 60px;
        }

        img {
          width: 50px;
          margin-left: 20px;
        }
      }
    }

    .description {
      position: relative;
      display: block;
      line-height: 28px;
      font-size: 18px;
      padding-left: 30px;
      margin: 0 0 17px 0;
      z-index: 1;

      &:before {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        content: "";
        background: #b096df;
      }
    }
  }

  @keyframes bounce-up-down {
    from {
      -webkit-transform: rotate(0deg);
      -webkit-transform-origin: 200px 200px;
      transform-origin: 200px 200px;
    }
    33% {
      -webkit-transform: rotate(0deg);
      -webkit-transform-origin: 180px 220px;
      transform-origin: 1000px 220px;
    }
    66% {
      -webkit-transform: rotate(1deg);
      -webkit-transform-origin: 200px 200px;
      transform-origin: 1500px 200px;
    }
    to {
      -webkit-transform: rotate(0deg);
      -webkit-transform-origin: 200px 200px;
      transform-origin: 200px 200px;
    }
  }

  @-webkit-keyframes bounce-up-down {
    from {
      -webkit-transform: rotate(0deg);
      -webkit-transform-origin: 200px 200px;
      transform-origin: 200px 200px;
    }
    33% {
      -webkit-transform: rotate(0deg);
      -webkit-transform-origin: 180px 220px;
      transform-origin: 1000px 220px;
    }
    66% {
      -webkit-transform: rotate(1deg);
      -webkit-transform-origin: 200px 200px;
      transform-origin: 1500px 200px;
    }
    to {
      -webkit-transform: rotate(0deg);
      -webkit-transform-origin: 200px 200px;
      transform-origin: 200px 200px;
    }
  }

  @keyframes opacity-controll {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.6;
    }
    75% {
      opacity: 0.2;
    }
    100% {
      opacity: 0;
    }
  }
  @-webkit-keyframes opacity-controll {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.6;
    }
    75% {
      opacity: 0.2;
    }
    100% {
      opacity: 0;
    }
  }

  #Path_46973 {
    animation: opacity-controll 1.5s infinite; /* IE 10+, Fx 29+ */
  }
  #Path_46974 {
    animation: opacity-controll 1.7s infinite; /* IE 10+, Fx 29+ */
  }
  #Path_46975 {
    animation: opacity-controll 1.9s infinite; /* IE 10+, Fx 29+ */
  }
  #Path_46976 {
    animation: opacity-controll 2s infinite; /* IE 10+, Fx 29+ */
  }

  @media only screen and (max-width: 2048px) {
    .banner__thumb {
      padding: 80px 0 20px 0;
      width: 40%;
      z-index: 2;
    }
    .coin-info {
      padding: 90px 0 0 0;
      div {
        margin: 12px 0px 5px 0px;
        img {
          margin-right: 10px;
        }
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    .banner__thumb {
      padding: 140px 0 20px 0;
      right: 0;
      width: 320px;
      z-index: 2;
    }
    .banner-content {
      .heading {
        font-size: 45px;
        line-height: 65px;
        font-weight: 600;
        z-index: 2;
      }
    }
    .coin-info {
      padding: 140px 0 0 0;
      div {
        margin: 12px 0px 5px 0px;
        img {
          margin-right: 10px;
        }
      }
    }
  }
  @media only screen and (max-width: 912px) {
    .banner__thumb {
      padding: 220px 0 0 0;
      width: 320px;
      z-index: 2;
    }
    .banner-content {
      //padding: 80px 0 20px 0;
      .heading {
        font-size: 40px;
        line-height: 60px;
        z-index: 2;
      }
    }
    .coin-info {
      padding: 180px 0 0 0;
      div {
        margin: 12px 0px 5px 0px;
        img {
          margin-right: 10px;
        }
      }
    }
  }
  @media only screen and (max-width: 768px) {
    .banner__thumb {
      padding: 220px 0 0 0;
      top: 100px
      width: 320px;
      z-index: 2;
    }
    .banner-content {
      padding: 20px 0 120px 0;
      .heading {
        font-size: 35px;
        line-height: 50px;
        z-index: 2;
      }
    }
    .coin-info {
      padding: 180px 0 0 0;
      div {
        margin: 12px 0px 5px 0px;
        img {
           margin-right: 10px;
        }
      }
    }
  }

  @media only screen and (max-width: 560px) {
    .banner__thumb {
      padding: 220px 0 0 0;
      top: 100px
      width: 320px;
      z-index: 2;
    }
    .banner-content {
      //padding: 250px 0 120px 0;

      .heading {
        z-index: 2;
        font-size: 30px;
        line-height: 50px;
        br {
          display: none;
        }
      }
      .text {
        z-index: 2;
        br {
          display: none;
        }
      }
    }
    .section__particle {
      &.bottom-right {
        display: none;
      }
    }
    .coin-info {
      padding: 180px 0 0 0;
      div {
        margin: 12px 0px 5px 0px;
        img {
          margin-right: 10px;
        }
      }
    }
  }
`;
export default BannerWrapper;
