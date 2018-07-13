import os, sys
import time
import argparse
import yaml
from collections import namedtuple

parser = argparse.ArgumentParser(description="A tool for consolidating YAML changelogs.")
parser.add_argument("-l", "--location", action="store", help="Only specify if changelog location differs from the script's location.")
parser.add_argument("-v", "--verbose", action="store_true")
parser.add_argument("-n", "--no-changes", action="store_true", help="Dry run, no file changes.")
args = parser.parse_args()

def verbose(msg):
    print(msg)

# not verbose => replace the def
if not args.verbose:
    def verbose(msg):
        pass
    verbose = verbose

files = []
logs = []

change = namedtuple("change", ("type", "value"))
log = namedtuple("log", ("author", "changes"))
counter = 0

# TODO: Possibly inside a class

def load_log(s):
    y = yaml.load(s)
    global counter
    counter += 1

if args.location:
    dir = args.location
else:
    dir = os.path.dirname(os.path.realpath(__file__))
print("Running in directory {}...".format(dir))
for f in os.listdir(dir):
    if not f.endswith(".yml") or f in ("template.yml", "changelog.yml"):
        verbose("Skipping file {}.".format(f))
        continue
    try:
        with open(os.path.join(dir, f), "r") as lf:
            verbose("Reading file {}.".format(f))
            try:
                load_log(lf.read())
            except Exception:
                print("Error when reading file {}. Skipping.".format(f))
                print(sys.exc_info())
                continue
    except Exception:
        print("Error when opening file {}. Skipping.".format(f))
        continue
    files.append(f)

if not args.no_changes:
    print("Purging directory {}...".format(dir))
    for f in files:
        try:
            os.remove(os.path.join(dir, f))
            verbose("Removing file {}.".format(f))
        except:
            print("Could not remove file {}.".format(f))
