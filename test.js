var steem = require('./index');

// Our function to get the numbers to calculate 
// the current steem per million vest
function getSteemPerMvest(callback) {
    steem.api.getDynamicGlobalProperties(function(err, result){
        
        // Get the total vesting fund steem 
        var total_vesting_fund_steem = result.total_vesting_fund_steem;
        // Trim just the number and convert it to a number
        total_vesting_fund_steem = Number(total_vesting_fund_steem.substring(0, total_vesting_fund_steem.length - 6));

        // Get the total vesting shares
        var total_vesting_shares = result.total_vesting_shares;
        // Trim just the number and convert it to a number
        total_vesting_shares = Number(total_vesting_shares.substring(0, total_vesting_shares.length - 6));

        // Formula for getting the current steem per million vest (with 3 decimal places)
        var steem_per_mvest = (total_vesting_fund_steem / (total_vesting_shares / 1000000)).toFixed(3);
        
        // Give our data back to our handler
        callback(steem_per_mvest);
    });
}

// Function to get the user account you want to check for current steem power
function getAccount(callback, steemPerMVest) {
    steem.api.getAccounts(['tyler-fletcher'], function(err, result) {
        // Give our user data to our user handler, also passing back the steem 
        // per million vest we calculated above
        callback(result, steemPerMVest);
    });
}

// Data handler
// Receive the user account and steem per million nest calculated above
function handleUser(account, steemPerMVest) {
    
    // Get the first account in the returned array 
    // We only searched for one account, but you can search multiple
    var vest = account[0].vesting_shares;
    vest = Number(vest.substring(0, vest.length - 6));

    var SP = ((vest * steemPerMVest)/1000000).toFixed(3);

    console.log("My Steem Power: " + SP);
};

// Data handler
function handleData(steem_per_mvest) {
    var steemPerMVest = steem_per_mvest;
    getAccount(handleUser, steemPerMVest);
};

getSteemPerMvest(handleData);
