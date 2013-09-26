DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
git pull origin master
npm update yadb yase refinery
node updateall