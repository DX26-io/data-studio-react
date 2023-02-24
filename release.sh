set -ex
# SET THE FOLLOWING VARIABLES
# sudo docker hub username
USERNAME=dx26io
# image name
IMAGE=data-studio
# ensure we're up to date
# git pull
# bump version
sudo docker run --rm -v "$PWD":/app treeder/bump patch
version=`cat VERSION`
echo "version: $version"
# run build
./build.sh
# tag it
git add VERSION
git commit -m "version $version"
git tag -a "$version" -m "version $version"
git push
git push --tags
sudo docker tag $USERNAME/$IMAGE:latest $USERNAME/$IMAGE:$version
# push it
sudo docker push $USERNAME/$IMAGE:latest
sudo docker push $USERNAME/$IMAGE:$version