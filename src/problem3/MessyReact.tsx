/***
 Problems In code:
 1. BoxProps- Didnt see its definition. Also, the naming convention can be made better such as
 using WalletProps.
 2. Line #39 'blockchain: any' any should be avoided in typescript. Instead, use a strongly typed version
 so that invalid values/ typo doesn't break the code.
 3. Line #52, ' return -99'  if the lowest priority is return -99, it can be made constant with an appropriate name.
 4. Line #59, 'if (lhsPriority > -99)' again we can use a constant instead of -99. This will help in clarifying
 what that is to avoid mental overhead.
 5. Line #76, 'formattedBalances' is unused and should be removed. Setting up eslinter, will help to find out
 these issues.
 6. Line #84, 'prices[balance.currency] * balance.amount;' we can think of situation where balance.currency is
 not available. So using defensive programming techniques can handle those cases.
 7. Line #39, 'getPriority' function can be moved out from component as its working on input and not on component
 state.
 8. Line #74, '}, [balances, prices]);', useMemo uses prices as dependencies. There are dependency between
 prices and balance calculation, so we can remove it. It will save computation on prices update.
 9. Line #58 'balancePriority' is unused but in next line we're using lhsPriority and its definition doesn't exist.

 ***/
interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) {
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
    }, [balances, prices]);

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
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

