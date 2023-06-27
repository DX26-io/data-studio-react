set -ex
# SET THE FOLLOWING VARIABLES
# sudo docker hub username
PLATFORM=dx26io
# image name
PROJECT=data-studio
# ensure we're up to date
# git pull
# bump version
sudo docker run --rm -v "$PWD":/app treeder/bump patch
version=`cat VERSION`
echo "version: $version"
# run build
sudo docker build -t $PLATFORM/$PROJECT:"v$version" .
# tag it
git add VERSION
git commit -m "version $version"
# git tag -a "v$version" -m "version $version"
git push origin tag "v$version"
sudo docker tag $PLATFORM/$PROJECT:"v$version" $PLATFORM/$PROJECT:latest
# push it
sudo docker push $PLATFORM/$PROJECT:latest
sudo docker push $PLATFORM/$PROJECT:"v$version"