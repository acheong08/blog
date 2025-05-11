#!/usr/bin/fish
gozer build
# set POD (kubectl get pod -l app=caddy -n statichost -o jsonpath='{.items[0].metadata.name}') ; kubectl exec -it -n statichost $POD -- sh -c 'rm -rf /tmp/build' && kubectl cp ./build/. $POD:/tmp/build -n statichost && kubectl exec -it -n statichost $POD -- sh -c 'rm -rf /srv/* && cp -r /tmp/build/* /srv/'
mcli mirror --overwrite --remove build r2/blog
