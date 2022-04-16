import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const Identicon = (account: any) => {
  // console.log(jsNumberForAddress(account.account));
  if (!account?.account?.length) {
    return null;
  }
  return (
    <Jazzicon diameter={16} seed={jsNumberForAddress(account.account) * 3} />
  );
};

export default Identicon;
