import {ReactNode} from "react";

interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props {
children:ReactNode,
}

enum POSSIBLE_BLOCKCHAINS {
    Osmosis = 100,
    Ethereum = 50,
    Arbitrum = 30,
    Zilliqa = 20,
    Neo = 20,
}

const LOWEST_PRIORITY = -99;
const getPriority = (blockchain: keyof typeof POSSIBLE_BLOCKCHAINS): number => {
    switch (blockchain) {
        case "Osmosis":
            return POSSIBLE_BLOCKCHAINS.Osmosis;
        case "Ethereum":
            return POSSIBLE_BLOCKCHAINS.Ethereum;
        case "Arbitrum":
            return POSSIBLE_BLOCKCHAINS.Arbitrum;
        case "Zilliqa":
            return POSSIBLE_BLOCKCHAINS.Zilliqa;
        case "Neo":
            return POSSIBLE_BLOCKCHAINS.Neo;
        default:
            return LOWEST_PRIORITY;
    }
};
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (balancePriority > LOWEST_PRIORITY) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
    }, [balances]);

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices?.[balance.currency] * balance.amount;
        if(!isNumber(usdValue)){
            // using lodash isNumber function. This can be done with the help of native functions too
            console.error('USD value calculation issue.')
        }
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}