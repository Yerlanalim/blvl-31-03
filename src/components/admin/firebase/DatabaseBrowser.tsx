'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ChevronRight, Database, Folder, File } from 'lucide-react';
import { toast } from 'sonner';

interface CollectionNode {
  type: 'collection';
  id: string;
  path: string;
  expanded: boolean;
  loading: boolean;
  children: (CollectionNode | DocumentNode)[];
}

interface DocumentNode {
  type: 'document';
  id: string;
  path: string;
  expanded: boolean;
  loading: boolean;
  children: CollectionNode[];
}

type TreeNode = CollectionNode | DocumentNode;

interface DatabaseBrowserProps {
  onSelectNode: (nodeType: 'collection' | 'document', path: string, id: string) => void;
}

export default function DatabaseBrowser({ onSelectNode }: DatabaseBrowserProps) {
  const [rootCollections, setRootCollections] = useState<CollectionNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with root collections
  useEffect(() => {
    fetchRootCollections();
  }, []);

  // Fetch root collections
  const fetchRootCollections = async () => {
    setLoading(true);
    try {
      // Since we can't directly get collections from client SDK,
      // we'll use a predefined list of common collections in the app
      const commonCollections = [
        'users', 
        'levels', 
        'artifacts', 
        'userProgress', 
        'faq', 
        'chatHistory'
      ];
      
      const collectionNodes: CollectionNode[] = [];
      
      for (const collId of commonCollections) {
        try {
          const collRef = collection(db, collId);
          const snapshot = await getDocs(collRef);
          
          if (snapshot.size > 0 || collId === 'users') {  // Always include users collection
            collectionNodes.push({
              type: 'collection',
              id: collId,
              path: collId,
              expanded: false,
              loading: false,
              children: []
            });
          }
        } catch (error) {
          console.warn(`Collection ${collId} not found or not accessible`);
        }
      }
      
      // Sort collections alphabetically
      collectionNodes.sort((a, b) => a.id.localeCompare(b.id));
      
      setRootCollections(collectionNodes);
    } catch (error) {
      console.error('Error fetching root collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  // Toggle node expansion
  const toggleNode = async (node: TreeNode, parentNodes: TreeNode[]) => {
    const updatedNodes = [...parentNodes];
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id && n.path === node.path);
    
    if (nodeIndex === -1) return;
    
    const updatedNode = { ...updatedNodes[nodeIndex] };
    updatedNode.expanded = !updatedNode.expanded;
    
    // If expanding and no children have been loaded yet, fetch them
    if (updatedNode.expanded && updatedNode.children.length === 0) {
      updatedNode.loading = true;
      updatedNodes[nodeIndex] = updatedNode;
      
      if (parentNodes === rootCollections) {
        setRootCollections(updatedNodes);
      } else {
        // This won't directly update the UI, but we'll update the parents later
      }
      
      try {
        if (updatedNode.type === 'collection') {
          // Fetch documents in this collection
          const collRef = collection(db, updatedNode.path);
          const snapshot = await getDocs(collRef);
          
          const docNodes: DocumentNode[] = [];
          snapshot.forEach(doc => {
            docNodes.push({
              type: 'document',
              id: doc.id,
              path: `${updatedNode.path}/${doc.id}`,
              expanded: false,
              loading: false,
              children: []
            });
          });
          
          // Sort documents alphabetically
          docNodes.sort((a, b) => a.id.localeCompare(b.id));
          
          updatedNode.children = docNodes;
        } else {
          // Fetch subcollections of this document
          // Note: Client SDK doesn't directly support this,
          // so we'll try common subcollections patterns
          const commonSubcollections = ['comments', 'history', 'items', 'metadata'];
          
          const subCollections: CollectionNode[] = [];
          
          for (const subCollId of commonSubcollections) {
            try {
              const subCollRef = collection(db, `${updatedNode.path}/${subCollId}`);
              const snapshot = await getDocs(subCollRef);
              
              if (snapshot.size > 0) {
                subCollections.push({
                  type: 'collection',
                  id: subCollId,
                  path: `${updatedNode.path}/${subCollId}`,
                  expanded: false,
                  loading: false,
                  children: []
                });
              }
            } catch (error) {
              // Ignore errors as subcollections might not exist
            }
          }
          
          updatedNode.children = subCollections;
        }
      } catch (error) {
        console.error(`Error fetching children for ${updatedNode.path}:`, error);
        toast.error(`Failed to load data for ${updatedNode.id}`);
      }
      
      updatedNode.loading = false;
      updatedNodes[nodeIndex] = updatedNode;
      
      if (parentNodes === rootCollections) {
        setRootCollections(updatedNodes);
      } else {
        // We need to update the parent structure recursively
        // This is a simplified version; a more robust solution would use a tree data structure
        updateParentNodes(rootCollections, node.path, updatedNode);
      }
    } else {
      updatedNodes[nodeIndex] = updatedNode;
      
      if (parentNodes === rootCollections) {
        setRootCollections(updatedNodes);
      } else {
        updateParentNodes(rootCollections, node.path, updatedNode);
      }
    }
  };

  // Recursive function to update a node in the tree
  const updateParentNodes = (nodes: TreeNode[], targetPath: string, updatedNode: TreeNode): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Check if this is the parent node
      if (node.path === targetPath) {
        const updatedNodes = [...nodes];
        updatedNodes[i] = updatedNode;
        return true;
      }
      
      // If this node has children, check them recursively
      if (node.children && node.children.length > 0) {
        const updated = updateParentNodes(node.children, targetPath, updatedNode);
        
        if (updated) {
          const updatedNodes = [...nodes];
          updatedNodes[i] = { ...node, children: [...node.children] };
          return true;
        }
      }
    }
    
    return false;
  };

  // Render a tree node recursively
  const renderNode = (node: TreeNode, level: number = 0, parentNodes: TreeNode[] = rootCollections) => {
    const paddingLeft = level * 16 + 8;
    
    return (
      <div key={`${node.path}-${node.id}`}>
        <div 
          className="flex items-center py-1 px-2 hover:bg-muted/50 rounded-sm cursor-pointer"
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            toggleNode(node, parentNodes);
            onSelectNode(node.type, node.path, node.id);
          }}
        >
          <ChevronRight 
            className={`h-4 w-4 transition-transform ${node.expanded ? 'rotate-90' : ''} 
                        ${node.children.length === 0 && node.expanded ? 'opacity-0' : 'opacity-100'}`}
          />
          
          {node.type === 'collection' ? (
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
          ) : (
            <File className="h-4 w-4 mr-2 text-green-500" />
          )}
          
          <span className="text-sm truncate">{node.id}</span>
          
          {node.loading && (
            <Loader2 className="h-3 w-3 ml-2 animate-spin" />
          )}
          
          <Badge 
            variant="outline" 
            className="ml-auto text-xs"
          >
            {node.type === 'collection' ? 'Collection' : 'Document'}
          </Badge>
        </div>
        
        {node.expanded && node.children.map(childNode => 
          renderNode(childNode, level + 1, node.children)
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/50 p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Database className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Database Browser</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRootCollections}
          className="h-7 w-7 p-0"
        >
          <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="p-1">
          {loading && rootCollections.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Loading collections...</span>
            </div>
          ) : rootCollections.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No collections found
            </div>
          ) : (
            rootCollections.map(node => renderNode(node))
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 