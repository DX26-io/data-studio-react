set -ex
# SET THE FOLLOWING VARIABLES
# docker hub username
USERNAME=dx26io
# image name
IMAGE=data-studio
sudo docker build -t $USERNAME/$IMAGE:latest .
# docker build -t dx26io/flair-notifications:latest .