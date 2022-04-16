import { createContext } from "react";

interface web3ModalInterface {
  _toggleModal: Function;
  connect: Function;
  connectTo: Function;
  eventController: Object;
  onClose: Function;
  onConnect: Function;
  onError: Function;
  providerController: Object;
  resetState: Function;
  themeColors: Object;
  updateState: Function;
  clearCachedProvider: any;
  updateTheme: Function;
}

export const web3Context = createContext<web3ModalInterface | null>(null);
